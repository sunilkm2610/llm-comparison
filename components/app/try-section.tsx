"use client";

import * as React from "react";
import { useInput } from "@/context/input-provider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Sample questions
const SAMPLE_QUESTIONS = [
  "What is the capital of France?",
  "Explain quantum computing in simple terms.",
  "How do I center a div in CSS?",
  "Write a short poem about the ocean.",
  "What are the benefits of TypeScript over JavaScript?",
];

export default function TrySection() {
  const { setInput } = useInput();

  return (
    <div className="max-w-xl mx-auto my-8">
      <Accordion type="single" collapsible>
        <AccordionItem value="sample-questions">
          <AccordionTrigger>
            {"Don't have anything in mind? Try a sample question"}
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2">
              {SAMPLE_QUESTIONS.map((q, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    className="w-full text-left rounded hover:bg-primary/10 px-2 py-1 transition-colors cursor-pointer"
                    onClick={() => setInput(q)}
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
