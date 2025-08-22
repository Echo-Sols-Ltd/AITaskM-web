import {redirect} from 'next/navigation';

export default function RootPage() {
  // Default to English locale
  redirect('/en');
}
