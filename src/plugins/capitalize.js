function capitalizeName(name) {

    if (name) {
        const words = name.split(" ");

        if (words.length < 2) {
          return (
            words[0].charAt(0).toUpperCase() +
            words[0].slice(1).toLowerCase()
          );
        } else {
          return (
            words[0].charAt(0).toUpperCase() +
            words[0].slice(1).toLowerCase() +
            " " +
            words[1].charAt(0).toUpperCase() +
            words[1].slice(1).toLowerCase()
          );
        }
    }
}

export default capitalizeName 