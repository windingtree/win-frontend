import {
  Container,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Iconify from '../components/Iconify';

const ExpandIcon = () => (
  <Iconify icon="material-symbols:expand-more-rounded" width={12} height={12} />
);

const faq = [
  {
    id: 'what-is-win',
    question: 'What is WIN.so?',
    answer:
      'Win.so is a Web 3.0 accommodation booking platform created by Winding Tree and Simard teams. It operates on smart contract technology and uses crypto-currency payments.'
  },
  {
    id: 'winding-tree',
    question: 'What is Winding Tree?',
    answer:
      'Winding Tree is one of the first blockchain startups, we have been building a decentralized marketplace for the travel industry since 2017. Winding tree is a non-profit open source organization gradually transforming into a DAO.'
  },
  {
    id: 'simard',
    question: 'What is Simard?',
    answer:
      'Simard is a company launched by the Winding Tree founders with the aim to onboard corporate clients in Web 3.0'
  },
  {
    id: 'lif',
    question: 'What is Lif token?',
    answer:
      'Lif token was minted during the ICO fund-raising that was happening in 2018. It grants rights to vote on the evolution of the platform.'
  },
  {
    id: 'decentralized',
    question: 'How decentralized is the platform?',
    answer:
      'Individual hoteliers and accommodation providers as well as corporate partners are not ready to fully use the blockchain for organizational, technical and legal reasons. Therefore we have built connectivity to their systems via Simard to onboard them.'
  },
  {
    id: 'cities',
    question: 'In how many cities can I book accommodations with WIN.so?',
    answer:
      'We have coverage for any important city globally, but we are currently limited with the currencies we support as we need at least a stablecoin pegged to the local currency of the hotel.'
  },
  {
    id: 'environment-blockchain',
    question: 'What are you doing about the environmental impact of using blockchain?',
    answer:
      'Smart contracts WIN is working on are deployed on the Gnosis chain and Polygon, which are cheap in gas fees and quite sustainable in energy consumption. We also give every traveler a chance to offset the carbon footprint with each booking.'
  },
  {
    id: 'book-room',
    question: 'How do I book a room with WIN.so?',
    answer:
      'Check the city, the dates, and availability. Connect your digital wallet, sign the transaction and make the booking.'
  },
  {
    id: 'personal-data',
    question: 'Why do you need my personal data?',
    answer:
      'Hoteliers need clients’ personal data to process the booking and make the reservation on their end. WIN doesn’t use this data for any other purposes.'
  },
  {
    id: 'special-about-win-1',
    question: 'What is so special about WIN.so?',
    answer:
      'With WIN you can travel sustainably: either you sustain nature or the travel ecosystem. We give you a chance to spend a sum a part of the booking in a way you prefer.'
  },
  {
    question: 'Where can I interact with other travelers who book with WIN.so?',
    answer: 'Right now both the community and the team are daily available on Discord.'
  },
  {
    id: 'credit-card',
    question: 'Can I book with WIN.so with my credit card?',
    answer:
      'The platform runs on smart contracts, they are fuelled with cryptocurrencies. You can use exchanges to buy crypto with your card. But in any case, you need to have your digital wallet.'
  },
  {
    id: 'digital-wallet',
    question: 'Is there a specific digital wallet needed to book with WIN.so?',
    answer:
      'At the moment we work with injected wallets such as MetaMask and WalletConnect. In the future we might integrate others.'
  },
  {
    id: 'special-about-win-2',
    question: 'What is so special about WIN?',
    answer:
      'In WIN we see the future of fear travel distribution when intermediaries don’t extract 10-20-30% commissions from the brands and communities. This way both travelers and accommodation providers benefit. This is our vision of sustainable travel.'
  },
  {
    id: 'report-issue',
    question: 'How to report issues?',
    answer:
      'If you have found any issues while booking or using our platform, please provide us with the details and print screens on Discord in the Support channel'
  },

  {
    id: 'group-booking',
    question: 'How does the deposit of a group booking work?',
    answer:
      'If you have found any issues while booking or using our platform, please provide us with the details and print screens on Discord in the Support channel'
  }
];

export const FaqAccordion = () => {
  const [expanded, setExpanded] = useState<string>();
  const accordionRef = useRef<HTMLDivElement>(null);
  const anchor = window.location.hash.split('#')[1];

  useEffect(() => {
    if (accordionRef.current) {
      const accExists = faq.find((q) => q.id === anchor);
      if (accExists) {
        setExpanded(anchor);
        //TODO: scroll into view is not working yet
        accordionRef.current.scrollIntoView();
      }
    }
  }, [accordionRef, anchor]);

  const handleChange =
    (panel: string | undefined) =>
    (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : undefined);
    };

  return (
    <Container sx={{ mb: 5, scrollBehavior: 'smooth' }}>
      <Typography variant="h3">FAQ</Typography>
      {faq.map((q) => (
        <Accordion
          ref={anchor === q.id ? accordionRef : null}
          key={q.id}
          id={q.id}
          expanded={expanded === q.id}
          onChange={handleChange(q.id)}
        >
          <AccordionSummary sx={{ pr: 2 }} expandIcon={<ExpandIcon />}>
            <Typography variant="subtitle1">{q.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{q.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  );
};
