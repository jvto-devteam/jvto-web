import Link from "@/components/website/AppLink";
import SEO from './SEO';
import FAQSection from './FAQSection';
import { faqs, faqsCopy, contactInfo } from '@/constants';
import Breadcrumbs from './Breadcrumbs';

const FaqPage: React.FC = () => {
    const breadcrumbCrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Travel Guide', path: '/travel-guide' },
        { name: 'FAQ', path: '/travel-guide/faq' },
    ];
  return (
    <>
      <div className="bg-background-light dark:bg-background-dark pt-20">
         <header className="py-12 bg-white dark:bg-ink-primary">
            <div className="container mx-auto px-4">
                <Breadcrumbs crumbs={breadcrumbCrumbs} />
            </div>
        </header>

        {/* The FAQSection component is self-contained with its own header, structured data, and accordion list */}
        <FAQSection copy={faqsCopy} faqs={faqs} />
        
        {/* "Still need help?" section, pulled up slightly into the FAQ section's bottom padding */}
        <div className="text-center pb-16 -mt-12 md:-mt-20">
            <p className="text-sm text-ink-neutral-700 dark:text-ink-neutral-300">
                Still need help? <Link className="underline text-primary" href="/contact/">Contact us</Link> or message us on 
                <a className="underline text-primary ml-1" href={contactInfo.whatsappLink} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
            </p>
        </div>
      </div>
    </>
  );
}

export default FaqPage;