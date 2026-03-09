/**
 * NucleuX Academy - ATOM v2: Session Manager (Lane Queue)
 * 
 * Prevents race conditions when a user sends multiple messages rapidly
 * in the same session, ensuring strict sequential processing of ATOM operations.
 */

const queues = new Map<string, Promise<void>>();

/**
 * Acquires a lock for a given session ID. 
 * Resolves when it's this request's turn.
 * Must call the returned release function when done.
 */
export async function acquireSessionLock(sessionId: string): Promise<() => void> {
    const currentPromise = queues.get(sessionId) || Promise.resolve();
    let release: () => void = () => { };

    const nextPromise = new Promise<void>((resolve) => {
        release = resolve;
    });

    const sequencePromise = currentPromise.then(() => nextPromise);
    queues.set(sessionId, sequencePromise);

    // Clean up the map once the entire chain for this session finishes
    sequencePromise.finally(() => {
        if (queues.get(sessionId) === sequencePromise) {
            queues.delete(sessionId);
        }
    });

    // Wait for our turn
    await currentPromise;

    return () => {
        release();
    };
}
