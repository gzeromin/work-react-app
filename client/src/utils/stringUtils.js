const getQueryString = (search) => {
  const queryString = search.substring(1);
  const queryArray = queryString.split('&');
  let result = {};
  queryArray.map(query => {
    const value = query.split('=');
    result[value[0]] = value[1];
  });
  return result;
}

export {
  getQueryString,
}