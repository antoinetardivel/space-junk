const getCorsFreeUrl = (url: string) => {
  return "https://api.allorigins.win/raw?url=" + url;
};

export default getCorsFreeUrl;
