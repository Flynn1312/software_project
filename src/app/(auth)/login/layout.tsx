export default function AuthLayout({ children }: {
    readonly children: React.ReactNode;
  }) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white-100 dark:bg-white-900">
        {children}
      </div>
    );
  }