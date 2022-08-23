import {
  Container,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from '@mui/material';
import { useState } from 'react';
import Iconify from '../components/Iconify';

const ExpandIcon = () => (
  <Iconify icon="material-symbols:expand-more-rounded" width={12} height={12} />
);

const faq = [
  {
    question: 'What is WIN.so?',
    answer:
      'Win.so is a web 2.5 accommodation booking platform created by Winding Tree and Simard teams. It operates on smart contract technology and uses crypto payments.'
  },
  {
    question: 'What is Winding Tree?',
    answer:
      'Winding Tree is one of the first blockchain startups have been building a decentralized marketplace for the travel industry since 2017. Winding tree is a non-profit open source organization gradually transforming into a DAO.'
  },
  {
    question: 'What is Simard?',
    answer:
      'Simard is a company launched by the Winding Tree founders with the aim to onboard corporate clients in Web 3.0'
  },
  {
    question: 'What is Lif token?',
    answer: 'Lif token was minted during the ICO fund-raising that was happening in 2018.'
  },
  {
    question: 'Why web 2.5?',
    answer:
      'Individual hoteliers and accommodation providers as well as corporate partners are not ready for a blockchain merge. Therefore we build a transition to Web 2.5 to make their onboarding process smooth and fast.'
  },
  {
    question: 'In how many cities can I book accommodations with WIN.so?',
    answer:
      'In the first stage, we plan to onboard hotels in the 50 most popular crypto and digital nomad cities.'
  },
  {
    question: 'What are you doing about the environmental impact of using blockchain?',
    answer:
      'Smart contracts WIN is working on are deployed on the Gnosis chain, which is cheap in gas fees and quite sustainable in energy consumption. We also give every traveler a chance to offset the carbon footprint with 10% from each booking.'
  },
  {
    question: 'How do I book a room with WIN.so?',
    answer:
      'Check the city, the dates, and availability. Connect your digital wallet, sign the transaction and make the booking.'
  },
  {
    question: 'Why do you need my personal data?',
    answer:
      'The platform is still Web 2.5 and hoteliers need clients’ personal data to process the booking and make the reservation on their end. WIN doesn’t keep any of this data for any purposes.'
  },
  {
    question: 'What is so special about WIN.so?',
    answer:
      'With WIN you can travel sustainably: either you sustain nature, local brands, or charities, as well as your personal finances. We give you a chance to spend a sum of approximately 10% of the booking in a way you prefer.'
  },
  {
    question: 'Where can I interact with other travelers who book with WIN.so?',
    answer: 'Right now both the community and the team are daily available on Discord.'
  },
  {
    question: 'Can I book with WIN.so with my credit card?',
    answer:
      'The platform runs on smart contracts, they are fuelled with cryptocurrencies. You can use Moon Pay exchange to buy crypto. But in any case, you need to have your digital wallet. Here is a quick tutorial on how to create your first wallet.'
  },
  {
    question: 'Is there a specific digital wallet needed to book with WIN.so?',
    answer:
      'At the moment we work with MetaMask and WalletConnect. In the nearest future we plan to integrate others.'
  },
  {
    question: 'How do I download and install MetaMask?',
    answer:
      'This is a very step-by-step process. This tutorial will navigate you through the process.'
  },
  {
    question: 'How to buy crypto?',
    answer:
      'When you have your wallet created, let’s proceed with the purchase of your first crypto. '
  },
  {
    question: 'What is so special about WIN?',
    answer:
      'In WIN we see the future of fear travel distribution when intermediaries don’t extract 10-20-30% commissions from the brands and communities. This way both travelers and accommodation providers benefit. This is our vision of sustainable travel.'
  },
  {
    question: 'How to report issues?',
    answer:
      'If you have found any issues while booking or using our platform, please provide us with the details and print screens to improve@win.so'
  }
];

export const FaqAccordion = () => {
  const [expanded, setExpanded] = useState<number>();

  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : undefined);
    };

  return (
    <Container sx={{ mb: 5 }}>
      <Typography variant="h3">FAQ</Typography>
      {faq.map((q, fIndex) => (
        <Accordion
          key={fIndex}
          expanded={expanded === fIndex}
          onChange={handleChange(fIndex)}
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
