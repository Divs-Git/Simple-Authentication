const getPeoplesData = async () => {
  const response = await fetch('https://fakerapi.it/api/v1/persons');
  const finalData = await response.json();
  document.getElementById('container').innerHTML = JSON.stringify(finalData);
  // fetch('https://fakerapi.it/api/v1/persons').then((res) => {
  //   res.json().then((data) => {
  //     console.log(data);
  //   });
  // });
};
