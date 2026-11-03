export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // GitHub's squash merges and some bots add long body lines; the header limit stays.
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
};
