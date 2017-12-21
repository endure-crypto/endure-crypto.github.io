"use strict";

function handleGenerate() {
  // Update UI so user knows something is happening.
  generateResult.innerText = "Generating seed, please wait.";
  generateResult.classList.remove('error');

  setTimeout(generate, 1);
}

async function generate() {
  try {
    // generate 128-bit entropy
    var entropy = generate_entropy(128);

    // convert the entropy to a word_list
    var entropyResult = document.createElement('div');
    entropyResult.className = 'mnemonic';
    entropyResult.innerText = await array_to_mnemonic(entropy);
    generateResult.appendChild(entropyResult);
  } catch (e) {
      generateResult.innerText = e.stack;
      generateResult.classList.add('error');
  }
};

function lpad(str, len) {
  return "0".repeat(len - str.length) + str;
}

function array_to_bits(buf) {
  return [...buf].map(e => lpad(e.toString(2), 8)).join('');
}

/**
 * Takes an array or Uint8Array and converts it to a mnemonic using the wordlist.
 */
async function array_to_mnemonic(buf) {
  var checksum = await deriveChecksumBits(buf);
  var binary = array_to_bits(buf) + checksum;
  // read data 11 bits at a time
  var chunks = binary.match(/.{1,11}/g).map(s => parseInt(s, 2))
  return chunks.map(i => wordlist[i]).join(' ');
}

async function deriveChecksumBits(buf) {
  return "0000";
}

/**
 * size: amount of entropy (in bits)
 * Returns a Uint8Array with random data.
 */
function generate_entropy(size) {
  // Check that size is
  if ((size < 128) || (size > 256) || (size % 32 != 0)) {
    throw new Error("invalid size: " + size);
  }
  var seed = new Uint8Array(size / 8); // create a 128-bit array
  crypto.getRandomValues(seed);        // fill it with random data
  return seed;
}
