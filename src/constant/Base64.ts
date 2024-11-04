const Base64 = (file1: any) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file1 && file1);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export default Base64;

/* How to call image */
/* const handleImage = async (e:any) => {
  const file = e.target.files[0];
  const base64 = await Base64(file);
  setImgFile(base64);
};
 */