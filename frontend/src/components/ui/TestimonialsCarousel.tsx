"use client";

import { useState } from "react";

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "Public Speaker",
    quote:
      "This platform helped me improve my articulation confidence. I now speak more clearly and purposefully!",
  },
  {
    name: "Michael Ade",
    role: "Content Creator",
    quote:
      "The daily speaking prompts keep me consistent. I can hear major progress in my tone and pacing.",
  },
  {
    name: "Amina Bello",
    role: "Student",
    quote:
      "I love how the evaluations are simple yet detailed. The feedback feels personal and encouraging.",
  },
];

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const testimonial = testimonials[index];

  const next = () => setIndex((index + 1) % testimonials.length);
  const prev = () =>
    setIndex((index - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="w-full max-w-xl mx-auto text-center space-y-4">
      <p className="text-gray-700 italic text-lg">“{testimonial.quote}”</p>
      <div>
        <p className="font-semibold">{testimonial.name}</p>
        <p className="text-sm text-gray-500">{testimonial.role}</p>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={prev}
          className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100"
        >
          Prev
        </button>
        <button
          onClick={next}
          className="px-3 py-1 rounded border text-gray-600 hover:bg-gray-100"
        >
          Next
        </button>
      </div>
    </div>
  );
}
