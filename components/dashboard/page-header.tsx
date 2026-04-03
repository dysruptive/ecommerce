interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-[#1C1917]">{title}</h1>
        {description && (
          <p className="mt-0.5 text-sm text-[#78716C]">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
