(() => {
    const value = ((()=>4))(); 
    console.log('"' + value + '"');
  })()