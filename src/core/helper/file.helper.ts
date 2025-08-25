export const extractFilename = (s: string) => {
  const filePath = s.replace(/(\.\/|\.vue)/g, "");
  const lastSlashIndex = filePath.lastIndexOf("/");
  const fileName = filePath.substring(lastSlashIndex + 1);

  return fileName;
};
