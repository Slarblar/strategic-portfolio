const baseSchemes = {
  sand: {
    card: 'bg-sand',
    cardHover: 'group-hover:bg-ink',
    title: 'text-ink group-hover:text-sand',
    descriptionText: 'text-ink/90 group-hover:text-sand/90',
    descriptionBullet: 'text-ink/60 group-hover:text-sand/60',
    rolesHeading: 'text-stone group-hover:text-sand',
    rolesList: 'text-stone group-hover:text-sand',
    button: {
      text: 'text-ink group-hover:text-orange',
      iconBg: 'bg-ink group-hover:bg-orange',
      iconColor: 'text-sand group-hover:text-ink',
    },
  },
  olive: {
    card: 'bg-olive',
    cardHover: 'group-hover:bg-orange',
    title: 'text-sand group-hover:text-ink',
    descriptionText: 'text-sand/90 group-hover:text-ink/90',
    descriptionBullet: 'text-sand/60 group-hover:text-ink/60',
    rolesHeading: 'text-sand/80 group-hover:text-ink/80',
    rolesList: 'text-sand/80 group-hover:text-ink/80',
    button: {
      text: 'text-sand group-hover:text-ink',
      iconBg: 'bg-sand group-hover:bg-ink',
      iconColor: 'text-ink group-hover:text-sand',
    },
  },
  'proper-green': {
    card: 'bg-proper-green',
    cardHover: 'group-hover:bg-custom-gray',
    title: 'text-sand group-hover:text-sand',
    descriptionText: 'text-sand/90 group-hover:text-sand/90',
    descriptionBullet: 'text-sand/60 group-hover:text-sand/60',
    rolesHeading: 'text-sand/80 group-hover:text-sand/80',
    rolesList: 'text-sand/80 group-hover:text-sand/80',
    button: {
      text: 'text-sand group-hover:text-ink',
      iconBg: 'bg-sand group-hover:bg-ink',
      iconColor: 'text-proper-green group-hover:text-sand',
    },
  },
  'custom-gray': {
    card: 'bg-custom-gray',
    cardHover: 'group-hover:bg-sky',
    title: 'text-sand group-hover:text-ink',
    descriptionText: 'text-sand/90 group-hover:text-ink/90',
    descriptionBullet: 'text-sand/60 group-hover:text-ink/60',
    rolesHeading: 'text-sand/80 group-hover:text-ink/80',
    rolesList: 'text-sand/80 group-hover:text-ink/80',
    button: {
      text: 'text-sand group-hover:text-ink',
      iconBg: 'bg-sand group-hover:bg-ink',
      iconColor: 'text-custom-gray group-hover:text-sky',
    },
  },
};

export const colorSchemes = {
  ...baseSchemes,
  // Project-specific overrides from user feedback
  'spacestation-animation': {
    card: 'bg-sand',
    cardHover: 'group-hover:bg-ink',
    title: 'text-ink group-hover:text-sand',
    descriptionText: 'text-ink group-hover:text-sand',
    descriptionBullet: 'text-ink group-hover:text-sand',
    rolesHeading: 'text-stone group-hover:text-sand',
    rolesList: 'text-stone group-hover:text-sand',
    button: {
      text: 'text-ink group-hover:text-sand',
      iconBg: 'bg-ink group-hover:bg-sand',
      iconColor: 'text-sand group-hover:text-ink',
    }
  },
  'a-for-adley': {
    ...baseSchemes.olive,
    button: {
      text: 'text-sand group-hover:text-ink',
      iconBg: 'bg-ink group-hover:bg-sand',
      iconColor: 'text-sand group-hover:text-ink'
    }
  },
  'proper-hemp-co': {
    ...baseSchemes['proper-green'],
    cardHover: 'group-hover:bg-stone',
    button: {
        text: 'text-sand group-hover:text-sand',
        iconBg: 'bg-sand group-hover:bg-proper-green',
        iconColor: 'text-proper-green group-hover:text-sand',
    }
  },
  'quarter-machine': {
    ...baseSchemes['custom-gray'],
  },
  // Default scheme to prevent errors
  default: {
    ...baseSchemes.sand,
  },
};

export const getColorScheme = (projectSlug, bgColor) => {
  // If a specific scheme for the project exists, use it.
  if (colorSchemes[projectSlug]) {
    return colorSchemes[projectSlug];
  }
  // Otherwise, use the scheme based on bgColor, or fall back to default.
  return colorSchemes[bgColor] || colorSchemes.default;
}; 