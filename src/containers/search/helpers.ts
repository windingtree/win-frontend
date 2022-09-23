import { format } from 'date-fns';
import { FieldError, FieldErrors, FieldErrorsImpl } from 'react-hook-form';

const formatDisplayDate = (date) => {
  const dayNumber = format(date, 'dd');
  const dayName = format(date, 'EEEE');
  const shortendDayName = dayName.slice(0, 3);
  const month = format(date, 'LLLL');
  const shortendMonth = month.slice(0, 3);

  const displayedDate = `${shortendDayName}, ${shortendMonth} ${dayNumber}`;
  return displayedDate;
};

export const startDateDisplay = (dateRange) => {
  const startDate = dateRange[0].startDate;

  if (!startDate) return 'Check-in';

  return formatDisplayDate(startDate);
};

export const endDateDisplay = (dateRange) => {
  const startDate = dateRange[0].endDate;

  if (!startDate) return 'Check-out';

  return formatDisplayDate(startDate);
};

interface ValidationErrorChunks {
  requiredErrors: string[];
  otherErrors: string[];
}

export const buildValidationErrors = (
  errors: FieldErrorsImpl | FieldErrors
): ValidationErrorChunks => {
  const requiredErrors: string[] = [];
  const otherErrors: string[] = [];

  Object.values(errors).forEach((error) => {
    if (!error) return;
    if (Array.isArray(error)) {
      const builtErrors = error
        .map((err: FieldErrors) => buildValidationErrors(err))
        .reduce(
          (result, value) => {
            result.requiredErrors.push(...value.requiredErrors);
            result.otherErrors.push(...value.otherErrors);

            return result;
          },
          { requiredErrors: [], otherErrors: [] }
        );

      requiredErrors.push(...builtErrors.requiredErrors);
      otherErrors.push(...builtErrors.otherErrors);
    }

    // check for required and other errors
    const message = (error as FieldError).message;
    if (message) {
      if (error.type === 'required' || error.type === 'typeError') {
        requiredErrors.push(message);
      } else {
        otherErrors.push(message);
      }
    }
  });

  return {
    requiredErrors,
    otherErrors
  };
};

export const buildValidationErrorMessage = ({
  otherErrors,
  requiredErrors
}: ValidationErrorChunks) => {
  let validationErrorMessage = '';
  const prefix = requiredErrors.length ? 'Please fill in' : 'Please';

  // join both arrays
  const combinedErrors = requiredErrors.concat(otherErrors);

  if (combinedErrors.length === 1) {
    validationErrorMessage = `${prefix} ${combinedErrors[0]}`;
  } else if (combinedErrors.length === 2) {
    validationErrorMessage = `${prefix} ${combinedErrors[0]} and ${combinedErrors[1]}`;
  }
  // append an "and" to the last item where applicable
  else if (combinedErrors.length > 2) {
    validationErrorMessage = combinedErrors.join(', ');
    const lastIndex = validationErrorMessage.lastIndexOf(',');
    validationErrorMessage =
      validationErrorMessage.substring(0, lastIndex) +
      ' and' +
      validationErrorMessage.substring(lastIndex + 1);
    validationErrorMessage = `${prefix} ${validationErrorMessage}`;
  }

  return validationErrorMessage;
};

export const getValidationErrorMessage = (errors: FieldErrorsImpl) => {
  if (!errors) return;
  const builtErrors = buildValidationErrors(errors);
  const message = buildValidationErrorMessage(builtErrors);

  return message;
};

export const autocompleteData = [
  ...new Set([
    'Amsterdam',
    'Berlin',
    'Bogota',
    'Sydney',
    'New York',
    'London',
    'Denver',
    'San Francisco',
    'Valletta',
    'San Salvador',
    'Las Vegas',
    'Buenos Aires',
    'Paris',
    'New York',
    'Singapore',
    'Kyoto',
    'Oakland',
    'Perth',
    'Nice',
    'Minneapolis',
    'Vienna',
    'Atlanta',
    'Helsinki',
    'Tallinn',
    'Warsaw',
    'Zurich',
    'Sydney',
    'Brussels',
    'Dallas',
    'Puerto Rico',
    'Cancun',
    'Austin',
    'Boston',
    'Perth',
    'Milan',
    'Palermo',
    'Phoenix',
    'Seattle',
    'Manchester',
    'Andorra la Vella'
  ])
];
