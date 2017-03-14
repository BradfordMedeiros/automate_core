(() => {
    const value = ((() => Math.random() > 0.5))(); 
    console.log('"' + value + '"');
  })()