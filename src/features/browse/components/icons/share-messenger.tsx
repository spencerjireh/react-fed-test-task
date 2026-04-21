interface ShareMessengerProps {
  size?: number;
}

export function ShareMessengerIcon({ size = 24 }: ShareMessengerProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 1C18.0751 1 23 5.92486 23 12C23 18.0751 18.0751 23 12 23C5.92486 23 1 18.0751 1 12C1 5.92486 5.92486 1 12 1ZM12 5.84082C8.51953 5.84082 5.69816 8.47063 5.69824 11.7139C5.69835 13.5531 6.60579 15.1948 8.02637 16.2715V18.5L10.1533 17.3301C10.7539 17.5008 11.3756 17.5866 12 17.5859C15.4803 17.5859 18.3016 14.9569 18.3018 11.7139C18.3018 8.47063 15.4805 5.84082 12 5.84082ZM12.6699 13.6807L11.0127 12L7.92188 13.7188L11.3311 10.0879L12.9639 11.792L16.0791 10.0527L12.6699 13.6807Z"
        fill="currentColor"
      />
    </svg>
  );
}
