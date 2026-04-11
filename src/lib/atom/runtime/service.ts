import type { SupabaseClient } from '@supabase/supabase-js';
import { 
  WorkflowMode, 
  WorkflowStatus, 
  WorkflowState, 
  WorkflowRuntimeConfig 
} from './types';
import { 
  updateTaskState, 
  appendTaskEvent, 
  runNucleuxOriginalDeepResearch, 
  runAtomOrchestratorStub 
} from '@/lib/atom/orchestrator';

export class AtomRuntimeService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * Resolves the appropriate execution path based on the mode and config.
   */
  async resolveMode(config: WorkflowRuntimeConfig): Promise<WorkflowMode> {
    // In Phase 9, we normalize modes.
    // 'task' mode in legacy often maps to 'deep-research' or 'guided-deep-dive'
    const mode = config.mode;
    
    if (mode === 'quick') return 'quick';
    if (mode === 'deep-research') return 'deep-research';
    if (mode === 'guided-deep-dive') return 'guided-deep-dive';
    
    // Fallback / Default
    return 'deep-research';
  }

  /**
   * Main entry point for executing a workflow run.
   * Ensures idempotency and manages the high-level state machine.
   */
  async executeWorkflow(config: WorkflowRuntimeConfig, taskId: string): Promise<void> {
    const resolvedMode = await this.resolveMode(config);
    
    try {
      await this.transitionState(taskId, 'initializing');
      
      switch (resolvedMode) {
        case 'deep-research':
          await this.handleDeepResearch(taskId, config);
          break;
        case 'guided-deep-dive':
          await this.handleGuidedDeepDive(taskId, config);
          break;
        case 'quick':
          await this.handleQuickRun(taskId, config);
          break;
        default:
          throw new Error(`Unsupported workflow mode: ${resolvedMode}`);
      }
      
      await this.transitionState(taskId, 'completed');
    } catch (error) {
      console.error(`[AtomRuntime] Workflow execution failed for task ${taskId}:`, error);
      await this.transitionState(taskId, 'failed', error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  private async transitionState(taskId: string, status: WorkflowStatus, errorMessage?: string): Promise<void> {
    const statusMap: Record<string, any> = {
      'initializing': { status: 'running' },
      'executing': { status: 'running' },
      'awaiting_input': { status: 'needs_input' },
      'completed': { status: 'completed' },
      'failed': { status: 'failed' },
      'cancelled': { status: 'cancelled' },
    };

    const updates = statusMap[status] || { status: 'running' };
    if (errorMessage) {
      updates.error_message = errorMessage.slice(0, 240);
      updates.error_code = 'runtime_execution_error';
    }

    await updateTaskState(this.supabase, taskId, updates);
    await appendTaskEvent(this.supabase, taskId, 'runtime.transition', { 
      to: status, 
      timestamp: new Date().toISOString() 
    });
  }

  private async handleDeepResearch(taskId: string, config: WorkflowRuntimeConfig): Promise<void> {
    // Map RuntimeConfig to DeepResearchConfig
    const deepResearchConfig = {
      workflow: 'nucleux-original-deep-research',
      topic: config.params.topic as string,
      level: config.params.level as string,
      goal: config.params.goal as string,
      includeReferences: config.params.includeReferences as boolean ?? true,
      clinicalContext: config.params.clinicalContext as string,
      roomProfile: config.context.roomProfile,
      orchestrationMetadata: config.params.orchestrationMetadata as Record<string, unknown>,
    };

    await this.transitionState(taskId, 'executing');
    await runNucleuxOriginalDeepResearch(this.supabase, taskId, deepResearchConfig);
  }

  private async handleGuidedDeepDive(taskId: string, config: WorkflowRuntimeConfig): Promise<void> {
    // GDD Implementation placeholder - will be wired to src/lib/atom/guided-deep-dive/runtime.ts
    await this.transitionState(taskId, 'executing');
    // For now, fallback to stub to keep system usable
    await runAtomOrchestratorStub(this.supabase, taskId);
  }

  private async handleQuickRun(taskId: string, config: WorkflowRuntimeConfig): Promise<void> {
    await this.transitionState(taskId, 'executing');
    // Quick runs typically bypass deep orchestration and go straight to a prompt
    await runAtomOrchestratorStub(this.supabase, taskId);
  }
}
