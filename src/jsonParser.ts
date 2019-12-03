export const TEST = {
  temp: () => console.log("jsonParser.temp()"),
  parser: (json: any) => {
      let obj = JSON.parse(json);
      return obj;
  }
};
