import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  children: ReactNode;
}

const FormSection = ({ title, children }: FormSectionProps) => (
  <section className="space-y-4 py-6 border-b border-border last:border-0">
    <h3 className="section-title">{title}</h3>
    <div className="space-y-3">{children}</div>
  </section>
);

export default FormSection;
