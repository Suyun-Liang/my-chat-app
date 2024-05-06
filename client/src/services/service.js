export async function postRequst(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    // if we receive an error object, it contains message prop
    let message = data?.message ? data.message : data;

    return { error: true, message };
  }

  return data;
}

export async function getRequest(url) {
  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    // if we receive an error object, it contains message prop
    let message = data?.message ? data.message : "An error occured...";

    return { error: true, message };
  }

  return data;
}
