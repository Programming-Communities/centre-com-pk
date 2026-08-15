// app/tools/calculators/loan-calculator/page.tsx
import type { Metadata } from "next";
import LoanCalculatorClient from "./tool.client";

export const metadata: Metadata = {
  title: "Loan Calculator - Calculate Loan Payments | Centre.com.pk",
  description: "Free online loan calculator. Calculate monthly payments, total interest, and amortization schedule for personal loans, car loans, and mortgages.",
  keywords: "loan calculator, mortgage calculator, car loan, personal loan, amortization, interest calculator",
};

export default function LoanCalculator() {
  return <LoanCalculatorClient />;
}