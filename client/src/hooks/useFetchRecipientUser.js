import { useEffect, useState } from "react";

import { getRequest } from "../services/service";
import { BASE_URL } from "../utils/constant";

export function useFetchRecipientUser(chat, sender) {
  const [recipient, setRecipient] = useState(null);
  const [error, setError] = useState(null);
  const recipientId = chat?.members.find((id) => id !== sender?._id);
  useEffect(() => {
    const getRecipient = async () => {
      if (!recipientId) return;
      try {
        const res = await getRequest(`${BASE_URL}/users/find/${recipientId}`);

        if (res?.error) setError(res);

        setRecipient(res);
      } catch (error) {
        console.error(error.message);
        setError(error);
      }
    };

    getRecipient();
  }, [recipientId]);

  return { recipient, error };
}
