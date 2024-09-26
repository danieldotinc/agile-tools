import Link from 'next/link';

const Header = () => (
  <header className="sticky top-0 z-40 flex items-center justify-between w-full h-16 px-4 border-b border-gray-200 mb-6">
    <div className="flex items-center">
      {/* <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense> */}
      <Link className="hidden sm:block text-black text-xl font-mono font-bold" href="/">
        AGILE-KIT
      </Link>
    </div>
    <div className="flex items-center justify-end space-x-2">
      <a
        target="_blank"
        href="https://github.com/vercel/nextjs-ai-chatbot/"
        rel="noopener noreferrer"
        //   className={cn(buttonVariants({ variant: 'outline' }))}
      >
        {/* <IconGitHub /> */}
        {/* <span className="hidden ml-2 md:flex">GitHub</span> */}
      </a>
    </div>
  </header>
);

export default Header;
