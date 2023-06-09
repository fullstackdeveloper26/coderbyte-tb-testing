const crypto = require("crypto");

// constants
const TRIVIAL_PARTITION_KEY  = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

// calculating sha
const hash = crypto.createHash("sha3-512");

/**
 * @param { partitionKey?: string } event Event Object (optional)
 * @returns {string } if event is present then hex representation of the event else TRIVIAL_PARTITION_KEY , the max length supported is 256 characters.
 */
const deterministicPartitionKey = (event) => {
  if (!event) return TRIVIAL_PARTITION_KEY ;

  let candidate;
  if (event.partitionKey) {
    candidate = event.partitionKey;
  } else {
    const data = JSON.stringify(event);
    candidate = hash.update(data).digest("hex");
  }

  if (typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  }

  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = hash.update(candidate).digest("hex");
  }
  return candidate;
};

module.exports = {
  deterministicPartitionKey,
};
