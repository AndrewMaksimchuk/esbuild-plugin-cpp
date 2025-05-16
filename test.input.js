#define assert(V) console.assert(V)

function main(input) {
  #ifdef DEBUG
    assert(input > 0);
  #endif
}

main(1);

