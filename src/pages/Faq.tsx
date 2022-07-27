import { PageWrapper } from './PageWrapper';
import { Accordion, AccordionPanel, Box, Text } from 'grommet';
const faq = [
  {
    question: 'How to setup Metamask',
    answers: ['hello']
  },
  {
    question: 'How to transfer DAI to Gnosis chain',
    answers: ['hello']
  },
  {
    question: 'How to buy crypto',
    answers: ['hello']
  },
  {
    question: 'How to search for accommodation',
    answers: ['hello']
  },
  {
    question: 'How to book',
    answers: ['hello']
  },
  {
    question: 'How to check in',
    answers: ['hello']
  },
  {
    question: 'How to refund',
    answers: ['hello']
  },
  {
    question: 'Why my deal is refused',
    answers: ['hello']
  },
  {
    question: 'How to report issues',
    answers: ['hello']
  }
];

export const Faq = () => {
  return (
    <PageWrapper
      breadcrumbs={[
        {
          label: 'Home',
          path: '/'
        }
      ]}
    >
      <Accordion>
        {faq.map((q) => (
          <AccordionPanel label={q.question}>
            {q.answers.map((a) => (
              <Box pad="medium" background="light-2">
                <Text>{a}</Text>
              </Box>
            ))}
          </AccordionPanel>
        ))}
      </Accordion>
    </PageWrapper>
  );
};
