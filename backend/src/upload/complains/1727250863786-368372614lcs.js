const args = process.argv.slice(2);

let ans = "";
let len = 0;

if (args.length) {
  for (let i = 0; i < args[0].length; i++) {
    for (let j = 1; j <= args[0].length - i; j++) {
      let str = args[0].substr(i, j);
      let found = true;
      args.forEach((el) => {
        if (!el.includes(str)) {
          found = false;
          return;
        }
      });
      if (found && j >= len) {
        len = j;
        ans = str;
      }
    }
  }
}
console.log(ans);
