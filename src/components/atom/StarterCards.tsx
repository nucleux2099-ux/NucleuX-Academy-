'use client';

import { Stethoscope, GraduationCap, FlaskConical } from 'lucide-react';

const CARDS = [
    {
        icon: Stethoscope,
        title: 'Clinical Consult',
        description: 'Structured approach with differentials, investigations & management plan',
        prompt: 'Given the clinical scenario, provide a structured approach covering differential diagnosis, key investigations, and evidence-based management plan.',
        color: '#5BB3B3',
    },
    {
        icon: GraduationCap,
        title: 'Exam Revision',
        description: 'High-yield facts, MCQ traps & clinical pearls for exam prep',
        prompt: 'Create a high-yield revision summary for this topic with key facts, common MCQ traps, and clinical pearls for exam preparation.',
        color: '#A78BFA',
    },
    {
        icon: FlaskConical,
        title: 'Research Synthesis',
        description: 'Synthesize evidence, highlight key studies & clinical implications',
        prompt: 'Synthesize the current evidence on this topic from selected sources, highlighting key studies and clinical implications.',
        color: '#60A5FA',
    },
];

type Props = {
    onSelect: (prompt: string) => void;
    disabled: boolean;
};

export function StarterCards({ onSelect, disabled }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl w-full">
            {CARDS.map((card) => {
                const Icon = card.icon;
                return (
                    <button
                        key={card.title}
                        onClick={() => onSelect(card.prompt)}
                        disabled={disabled}
                        className="group text-left rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 hover:bg-card hover:border-border hover:shadow-matte-md transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed card-hover"
                    >
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center mb-3.5 transition-transform duration-200 group-hover:scale-110"
                            style={{
                                background: `${card.color}10`,
                                border: `1px solid ${card.color}25`,
                            }}
                        >
                            <Icon className="w-4 h-4" style={{ color: card.color }} />
                        </div>
                        <h3 className="text-[13px] font-semibold text-foreground mb-1.5">{card.title}</h3>
                        <p className="text-[11px] text-muted-foreground leading-[1.6] group-hover:text-muted-foreground/80 transition-colors">{card.description}</p>
                    </button>
                );
            })}
        </div>
    );
}
