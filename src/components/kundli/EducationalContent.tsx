import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function EducationalContent() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Understanding Kundli Matching</h2>
      <Accordion type="multiple" className="space-y-2">
        <AccordionItem value="what" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-semibold">What is Kundli Matching?</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground space-y-2">
            <p>Kundli Matching, also known as Kundali Milan or Horoscope Matching, is an ancient Vedic astrology practice used to assess compatibility between two individuals before marriage. It compares the birth charts (Kundlis) of the prospective bride and groom.</p>
            <p>The process uses the Ashtakoot system, evaluating 8 different aspects (Kootas) of compatibility, totaling a maximum of 36 Gunas (points). A higher score indicates better compatibility.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="guna" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-semibold">Importance of Guna Milan</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground space-y-2">
            <p>Guna Milan is the cornerstone of Kundli matching. The 36-point system evaluates compatibility across spiritual, emotional, physical, and practical dimensions. A score of 18 or above is generally considered acceptable, while 24+ indicates a very good match.</p>
            <p>The 8 Kootas — Varna, Vasya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi — each assess different facets of married life.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="manglik" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-semibold">Role of Manglik Dosha</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground space-y-2">
            <p>Manglik Dosha (Mangal Dosha) occurs when Mars is placed in the 1st, 2nd, 4th, 7th, 8th, or 12th house of the birth chart. It is believed to influence marital harmony.</p>
            <p>When both partners are Manglik, the dosha is considered neutralized. Various remedies exist including specific pujas, gemstone recommendations, and charitable acts.</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="score" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-semibold">Why Compatibility Score Matters</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground space-y-2">
            <p>The compatibility score provides a structured framework for evaluating relationship potential:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Below 18:</strong> Generally not recommended without careful analysis</li>
              <li><strong>18–24:</strong> Average compatibility, workable with effort</li>
              <li><strong>24–32:</strong> Very good compatibility</li>
              <li><strong>32–36:</strong> Excellent match</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="disclaimer" className="border rounded-lg px-4">
          <AccordionTrigger className="text-sm font-semibold">Important Disclaimer</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground space-y-2">
            <p>Vedic astrology is an ancient tradition of interpretation and guidance. While Kundli matching provides valuable insights, it should be considered as one of many factors in deciding on a life partner.</p>
            <p>This tool uses traditional Vedic astrology algorithms with simplified astronomical calculations. For comprehensive analysis, consult a qualified astrologer. Personal compatibility, mutual respect, shared values, and communication are equally important foundations for a successful marriage.</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
