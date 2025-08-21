import { redirect } from 'next/navigation';

const Page = () => {
  redirect('/search?category=all'); // Perform the server-side redirect
};

export default Page;