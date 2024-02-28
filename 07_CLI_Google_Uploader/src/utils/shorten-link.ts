import axios from "axios";

interface ITinyUrlResponse {
  data: {
    tiny_url: string;
    url: string;
  };
  code: 0;
  errors: [];
}

export const makeShortenLink = async (link: string) => {
  const response = await axios.post<ITinyUrlResponse>(
    `https://api.tinyurl.com/create?api_token=${process.env.LINK_TOKEN}`,
    { url: link }
  );

  return response.data.data.tiny_url;
};
