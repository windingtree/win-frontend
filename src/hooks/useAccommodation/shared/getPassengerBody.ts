enum PassengerType {
  child = 'CHD',
  adult = 'ADT'
}

export const getPassengersBody = (
  adultCount: number,
  childrenCount: number | undefined
) => {
  const adults = {
    type: PassengerType.adult,
    count: adultCount
  };
  const passengers = [adults];

  if (childrenCount && childrenCount != 0) {
    const children = {
      type: PassengerType.child,
      count: childrenCount,
      childrenAges: Array.from({ length: childrenCount }, () => 12)
    };
    passengers.push(children);
  }

  return passengers;
};
