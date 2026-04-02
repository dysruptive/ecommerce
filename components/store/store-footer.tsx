interface StoreFooterProps {
  storeName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
}

export function StoreFooter({
  storeName,
  contactEmail,
  contactPhone,
}: StoreFooterProps) {
  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{storeName}</p>
          {contactEmail && <p>{contactEmail}</p>}
          {contactPhone && <p>{contactPhone}</p>}
        </div>
      </div>
    </footer>
  );
}
