const SAMPLE_CHARM_BASE_URL =
  "https://storage.googleapis.com/kutezadmin.appspot.com/user_charms_v3";
const SAMPLE_MODEL_BASE_URL =
  "https://storage.googleapis.com/kutezadmin.appspot.com/user_model_photos_v3";

const createSample = (prompt) => ({
  url: `${SAMPLE_CHARM_BASE_URL}/${prompt.toLowerCase()}.png`,
  modelUrl: `${SAMPLE_MODEL_BASE_URL}/${prompt.toLowerCase()}.png`,
  prompt,
});
// Sample data for regular charms
export const REGULAR_CHARM_SAMPLES = [
  "Letter A with wings",
  "Sea star with texture and letter A",
  "Rabbit holding a heart and letter C inside the heart",
  "The letter M intertwined with ivy leaves",
  "Cherries with woven texture",
  "Teddy bear with uneven texture",
  "Lily with embossed texture",
  "Heart with chain stitch",
  "Cat with wings",
  "Dragon sleeping in a teacup",
  "Dewdrops on a spider web",
  "Old phone",
  "Scorpio and Pisces in a circle",
  "Leo in a heart",
  "Aries and Gemini",
  "Taurus bull flying",
  "Border collie head",
  "Boxer dog",
  "Hamster",
  "Goldfish",
].map(createSample);

// Sample data for birthday charms
export const BIRTHDAY_CHARM_SAMPLES = [
  {
    url: "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Fcat%20foot.png?alt=media&token=cat%20foot",
    modelUrl:
      "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/model_images%2Fcat%20foot.png?alt=media&token=cat%20foot",
    prompt: "cat foot",
  },
];

// Sample data for zodiac charms
export const ZODIAC_CHARM_SAMPLES = [
  {
    url: "https://storage.googleapis.com/kutezadmin.appspot.com/user_charms_v2/Aries Zodiac Capricorn Rising Zodiac Spirit.png",
    modelUrl:
      "https://storage.googleapis.com/kutezadmin.appspot.com/user_model_photos/Aries%20Zodiac%20Capricorn%20Rising%20Zodiac%20Spirit.png",
    prompt: "Aries Zodiac Capricorn Rising Zodiac Spirit",
  },
];

// Sample data for pet charms
export const PET_CHARM_SAMPLES = [
  {
    url: "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/user_charms%2Fdog.png?alt=media&token=dog",
    modelUrl:
      "https://firebasestorage.googleapis.com/v0/b/kutezadmin.appspot.com/o/model_images%2Fdog.png?alt=media&token=dog",
    prompt: "the head of the pet in the attached image",
  },
];

// Storage keys
export const STORAGE_KEYS = {
  REGULAR: "userGeneratedCharms_v2",
  BIRTHDAY: "birthdayCharmGenerations",
  ZODIAC: "zodiacCharmGenerations",
  PET: "petCharmGenerations",
};

// Blueprint URL
export const BLUEPRINT_URL =
  "https://storage.googleapis.com/kutezadmin.appspot.com/user_charms_v3/hamster.png?v=<?=Date.now()?>";

// Birthday charm suffixes
export const BIRTHDAY_SUFFIXES = [
  "birthday aura",
  "birthday spirit",
  "birthday energy",
];

// Zodiac charm suffixes
export const ZODIAC_SUFFIXES = ["Aura", "Spirit", "Energy", "Love"];
