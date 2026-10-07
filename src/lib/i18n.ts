/**
 * Guest-only build — lightweight UI translation.
 *
 * The dictionary covers the application shell: navbar, landing page,
 * settings and the room lobby. In-game round text (banners, modals,
 * trick labels) stays in English for now.
 *
 * Settings → Language picks the language; it is stored in the browser
 * only (no account, no server round-trip).
 */

export type Lang = "en" | "fr";

export const LANGS: readonly Lang[] = ["en", "fr"];

export const DICT: Record<Lang, Record<string, string>> = {
  en: {
    // ---- Navbar ----
    "nav.settings": "Settings",
    "nav.sound": "Sound effects",
    "nav.guest": "Guest",

    // ---- Landing ----
    "home.tagline":
      "Four players, eight modes each. King of Hearts, Diamonds, Queens, Turns, Last Trick, Trix, General and Fifty One — play with friends, guests or bots. No account needed.",
    "home.playingAs": "Playing as",
    "home.changeSettings": "change in Settings",
    "home.createTitle": "Create room",
    "home.roomCode": "Room code",
    "home.newCode": "New code",
    "home.bots": "Number of bots",
    "home.gameType": "Game type",
    "home.fullMatch": "Full Match",
    "home.quickTest": "Quick Test",
    "home.quickBadge": "1 Rnd",
    "home.mode": "Mode",
    "home.createCta": "Create room",
    "home.joinTitle": "Join a room",
    "home.joinHint": "Enter the room code — you join as a guest, your nickname is generated automatically.",
    "home.joinCta": "Join room",
    "home.error.code": "Enter an invite code",
    "home.error.create": "Could not create room",

    // ---- Settings ----
    "settings.title": "Settings",
    "settings.backToRoom": "Back to room",
    "settings.guest": "Guest identity",
    "settings.name": "Guest name",
    "settings.newName": "New name",
    "settings.avatar": "Avatar",
    "settings.sound": "Sound effects",
    "settings.animations": "Animations",
    "settings.theme": "Theme",
    "settings.cardStyle": "Card style",
    "settings.language": "Language",
    "settings.apply": "Apply",
    "settings.applied": "Applied ✓",
    "settings.hintLocal": "All settings are saved in this browser only.",
    "settings.hintName": "Your name and avatar apply the next time you join a room.",
    "theme.dark": "Dark",
    "theme.light": "Light",
    "card.classic": "Classic",
    "card.modern": "Modern",
    "card.minimal": "Minimal",
    "lang.en": "English",
    "lang.fr": "Français",

    // ---- Lobby ----
    "lobby.title": "Lobby",
    "lobby.invite": "Invite code",
    "lobby.copyLink": "Copy link",
    "lobby.copied": "Copied!",
    "lobby.shareHint": "Share this code so friends can join from any device.",
    "lobby.emptySeat": "Empty seat",
    "lobby.host": "(host)",
    "lobby.bot": "— bot",
    "lobby.remove": "Remove",
    "lobby.gameType": "Game Type:",
    "lobby.fullMatch": "Full Match",
    "lobby.quickTest": "Quick Test (1 Rnd)",
    "lobby.testMode": "Test Mode:",
    "lobby.botDifficulty": "Bot difficulty:",
    "lobby.addBot": "Add bot",
    "lobby.fillBots": "Fill with bots",
    "lobby.start": "Start game",
    "lobby.startQuick": "Start Quick Test",
    "lobby.waiting": "Waiting for the host to start the game…",

    // ---- Mode names (landing + lobby selects) ----
    "mode.KingOfHearts": "King of Hearts",
    "mode.Diamonds": "Diamonds",
    "mode.Queens": "Queens",
    "mode.Turns": "Turns",
    "mode.LastTrick": "Last Trick",
    "mode.Trix": "Trix",
    "mode.General": "General",
    "mode.FiftyOne": "Fifty One",
    "mode.Switch": "Switch",
    "mode.Star": "⭐ Star",
  },
  fr: {
    // ---- Barre de navigation ----
    "nav.settings": "Paramètres",
    "nav.sound": "Effets sonores",
    "nav.guest": "Invité",

    // ---- Page d'accueil ----
    "home.tagline":
      "Quatre joueurs, huit modes. Roi de Cœur, Carreaux, Dames, Tours, Dernière plie, Trix, Général et Cinquante et un — jouez avec vos amis, des invités ou des robots. Aucun compte requis.",
    "home.playingAs": "Vous jouez sous le nom",
    "home.changeSettings": "modifier dans les réglages",
    "home.createTitle": "Créer une salle",
    "home.roomCode": "Code de la salle",
    "home.newCode": "Nouveau code",
    "home.bots": "Nombre de robots",
    "home.gameType": "Type de partie",
    "home.fullMatch": "Partie complète",
    "home.quickTest": "Test rapide",
    "home.quickBadge": "1 manche",
    "home.mode": "Mode",
    "home.createCta": "Créer la salle",
    "home.joinTitle": "Rejoindre une salle",
    "home.joinHint": "Saisissez le code de la salle — vous rejoignez en invéité, votre pseudo est généré automatiquement.",
    "home.joinCta": "Rejoindre",
    "home.error.code": "Saisissez un code d'invitation",
    "home.error.create": "Impossible de créer la salle",

    // ---- Réglages ----
    "settings.title": "Réglages",
    "settings.backToRoom": "Retour à la room",
    "settings.guest": "Identité invité",
    "settings.name": "Pseudo",
    "settings.newName": "Nouveau pseudo",
    "settings.avatar": "Avatar",
    "settings.sound": "Effets sonores",
    "settings.animations": "Animations",
    "settings.theme": "Thème",
    "settings.cardStyle": "Style des cartes",
    "settings.language": "Langue",
    "settings.apply": "Appliquer",
    "settings.applied": "Appliqué ✓",
    "settings.hintLocal": "Tous les réglages sont enregistrés uniquement dans ce navigateur.",
    "settings.hintName": "Votre pseudo et votre avatar s'appliquent à la prochaine partie rejointe.",
    "theme.dark": "Sombre",
    "theme.light": "Clair",
    "card.classic": "Classique",
    "card.modern": "Moderne",
    "card.minimal": "Minimal",
    "lang.en": "English",
    "lang.fr": "Français",

    // ---- Salon ----
    "lobby.title": "Salon d'attente",
    "lobby.invite": "Code d'invitation",
    "lobby.copyLink": "Copier le lien",
    "lobby.copied": "Copié !",
    "lobby.shareHint": "Partagez ce code pour que vos amis rejoignent depuis n'importe quel appareil.",
    "lobby.emptySeat": "Siège libre",
    "lobby.host": "(hôte)",
    "lobby.bot": "— robot",
    "lobby.remove": "Retirer",
    "lobby.gameType": "Type de partie :",
    "lobby.fullMatch": "Partie complète",
    "lobby.quickTest": "Test rapide (1 manche)",
    "lobby.testMode": "Mode de test :",
    "lobby.botDifficulty": "Difficulté des robots :",
    "lobby.addBot": "Ajouter un robot",
    "lobby.fillBots": "Remplir avec des robots",
    "lobby.start": "Lancer la partie",
    "lobby.startQuick": "Lancer le test rapide",
    "lobby.waiting": "En attente de l'hôte pour lancer la partie…",

    // ---- Noms des modes (sélecteurs accueil + salon) ----
    "mode.KingOfHearts": "Roi de Cœur",
    "mode.Diamonds": "Carreaux",
    "mode.Queens": "Dames",
    "mode.Turns": "Tours",
    "mode.LastTrick": "Dernière plie",
    "mode.Trix": "Trix",
    "mode.General": "Général",
    "mode.FiftyOne": "Cinquante et un",
    "mode.Switch": "Échange",
    "mode.Star": "⭐ Étoile",
  },
};

/** Translate a shell key, falling back to English and finally to the key itself. */
export function translate(lang: Lang, key: string): string {
  return DICT[lang]?.[key] ?? DICT.en[key] ?? key;
}
