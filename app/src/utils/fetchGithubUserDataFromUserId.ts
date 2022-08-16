export default async (userId: string) => {
  try {
    const response = await fetch(`https://api.github.com/user/${userId}`);
    const data = await response.json();
    if (data.message === "Not Found") {
      return { err: true };  
    }
    return { err: false, data };
  } catch (error) {
    return { err: true };
  }
}