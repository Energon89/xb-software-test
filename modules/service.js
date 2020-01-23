export const getStatesJson = async () => {
  const response = await fetch('https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_titlecase.json');
  const statesJson = await response.json();
  return statesJson;
}