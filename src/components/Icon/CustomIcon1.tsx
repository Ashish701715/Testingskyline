import { FC } from 'react';

interface CustomIcon1Props {
    className?: string;
    fill?: boolean;
    duotone?: boolean;
}

const CustomIcon1: FC<CustomIcon1Props> = ({ className, fill = false, duotone = true }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="45" height="48" viewBox="0 0 45 48" fill="none">
        <path d="M3.13441 45.8651V47.0883C3.1327 47.5271 3.49354 47.8841 3.94042 47.8859H41.1657C41.6125 47.8841 41.9734 47.5271 41.9717 47.0883V45.8651C41.9717 39.3429 36.9914 33.9919 30.6416 33.6059C30.6236 33.6053 30.6058 33.6053 30.5879 33.6059H14.5198C14.5018 33.6053 14.4839 33.6053 14.466 33.6059C8.1163 33.9919 3.13441 39.3429 3.13441 45.8651Z" fill="#5299D3"/>
        <path d="M18.5108 28.4219C18.0633 28.4194 17.6987 28.7739 17.6969 29.2133V36.7222C17.6987 37.1616 18.0633 37.5161 18.5108 37.5136H26.5978C27.0447 37.5153 27.4084 37.161 27.4102 36.7222C27.4102 34.3788 27.4102 31.9956 27.4102 29.2133C27.4084 28.7745 27.0447 28.4202 26.5978 28.4219H18.5108Z" fill="#FFCCAA"/>
        <path d="M18.5108 28.4219C18.4044 28.4213 18.299 28.4413 18.2005 28.4807C18.102 28.5202 18.0123 28.5783 17.9368 28.6518C17.8612 28.7253 17.8011 28.8127 17.7599 28.9091C17.7188 29.0054 17.6973 29.1087 17.6969 29.2132V31.5079C19.0615 32.4804 20.7365 33.0609 22.5533 33.0609C24.3702 33.0609 26.0449 32.4804 27.4098 31.5079V29.2132C27.4089 29.0025 27.3228 28.8008 27.1705 28.6524C27.0182 28.504 26.812 28.4211 26.5975 28.4219H18.5108Z" fill="#FFB889"/>
        <path d="M14.4671 33.6059C8.11741 33.9919 3.1344 39.3439 3.1344 45.866V47.0887C3.13278 47.5275 3.49358 47.8844 3.94039 47.8862H5.55867C5.11186 47.8844 4.75107 47.5275 4.75269 47.0887V45.866C4.75269 39.3439 9.7357 33.9919 16.0854 33.6059H14.5209C14.503 33.6053 14.485 33.6053 14.4671 33.6059Z" fill="#3385C8"/>
        <path d="M16.316 31.4375L13.8854 33.8179C13.5716 34.1279 13.5716 34.6284 13.8854 34.9383L19.5543 40.4984C19.87 40.8065 20.3798 40.8065 20.6954 40.4984L22.5524 38.6797L24.411 40.4984C24.7266 40.8065 25.2364 40.8065 25.552 40.4984L31.2147 34.9383C31.5285 34.6284 31.5285 34.1279 31.2147 33.8179L28.7887 31.4375C28.6342 31.2848 28.4232 31.2003 28.204 31.2032C27.9924 31.2061 27.7905 31.2902 27.6413 31.4375L22.5524 36.4343L17.4571 31.4375C17.3041 31.2864 17.0957 31.202 16.8787 31.2032C16.6672 31.2061 16.4652 31.2902 16.316 31.4375Z" fill="#A0C7E7"/>
        <path d="M22.1469 0.319571L1.10995 11.3127C0.554144 11.6034 0.577554 12.3341 1.15104 12.5953L13.3661 18.0933L13.728 17.4378L13.7312 17.4393H31.3719L31.7338 18.0934L43.9552 12.5954C44.529 12.3347 44.5533 11.604 43.9978 11.3128L22.9593 0.319606C22.8424 0.258423 22.7232 0.217706 22.5535 0.220876C22.3839 0.224047 22.2527 0.264091 22.1469 0.319571Z" fill="#5299D3"/>
        <path d="M14.5801 19.9121C12.892 19.9121 11.5631 21.3479 11.5631 23.0328C11.5631 24.7177 12.892 26.1581 14.5801 26.1581C14.8152 26.1581 15.0465 26.1192 15.2739 26.0619C15.2738 26.0558 15.2708 26.0508 15.2708 26.0448V19.9975C15.0447 19.9424 14.8129 19.9121 14.5801 19.9121Z" fill="#FFB889"/>
        <path d="M33.5464 23.0328C33.5464 24.7177 32.2175 26.1581 30.5294 26.1581C30.2943 26.1581 30.0631 26.1191 29.8356 26.0619C29.8357 26.0558 29.8386 26.0508 29.8386 26.0448V19.9975C30.0647 19.9424 30.2965 19.9121 30.5293 19.9121C32.2175 19.9121 33.5464 21.3479 33.5464 23.0328Z" fill="#FFCCAA"/>
        <path d="M22.553 12.0273C20.0378 12.0273 17.7681 12.2491 16.0669 12.6434C15.2163 12.8406 14.5085 13.0718 13.946 13.3883C13.3899 13.7011 12.8644 14.1807 12.8523 14.8966C12.8052 15.1292 12.2487 18.0144 14.5134 20.2332L14.752 20.4675H30.3539L30.5878 20.2332C32.8525 18.0144 32.3007 15.1292 32.2536 14.8966C32.2415 14.1808 31.7176 13.7011 31.1615 13.3883C30.599 13.0718 29.8912 12.8406 29.0406 12.6434C27.3394 12.2491 25.0681 12.0273 22.553 12.0273Z" fill="#356287"/>
        <path d="M16.0679 12.6452C15.2173 12.8424 14.5096 13.0735 13.9471 13.39C13.391 13.7028 12.864 14.1822 12.8519 14.898C12.8048 15.1307 12.2498 18.0164 14.5144 20.2353L14.7531 20.4695H16.3714L16.1327 20.2353C13.8681 18.0164 14.423 15.1307 14.4702 14.898C14.4822 14.1822 15.0093 13.7028 15.5654 13.39C16.1279 13.0735 16.8356 12.8424 17.6862 12.6452C19.2 12.2943 21.1764 12.0893 23.3629 12.0464C23.0919 12.041 22.831 12.0293 22.5537 12.0293C20.0386 12.0293 17.7691 12.2509 16.0679 12.6452Z" fill="#2C5170"/>
        <path d="M20.552 14.5938C20.4456 14.5926 20.34 14.612 20.2413 14.6509C20.1425 14.6898 20.0525 14.7474 19.9765 14.8205C19.9005 14.8936 19.8398 14.9806 19.7981 15.0767C19.7564 15.1729 19.7344 15.2761 19.7333 15.3806C19.7142 17.1631 18.2554 18.5881 16.4429 18.5881H15.0869C14.8734 18.5889 14.6689 18.6726 14.5179 18.8208C14.3669 18.9691 14.2817 19.1699 14.2809 19.3795V23.3676C14.2809 27.8471 17.9837 31.4742 22.5528 31.4742C27.122 31.4742 30.8263 27.8471 30.8263 23.3676V19.3795C30.8255 19.1699 30.7403 18.9691 30.5893 18.8208C30.4383 18.6726 30.2338 18.5889 30.0203 18.5881H25.2648C23.296 18.5881 21.6385 17.1771 21.3406 15.2688C21.3118 15.0829 21.2168 14.913 21.0723 14.7894C20.9279 14.6658 20.7436 14.5965 20.552 14.5938Z" fill="#FFCCAA"/>
        <path d="M7.17816 8.14062L5.55823 8.98715V20.0795H7.17816V8.14062Z" fill="#EEEEEE"/>
        <path d="M5.56491 18.4922C5.11803 18.4905 4.75436 18.8448 4.75257 19.2836V26.457C4.75086 26.8982 5.11556 27.2563 5.56491 27.2546H7.18C7.62688 27.2528 7.98772 26.8958 7.98601 26.457V19.2836C7.98424 18.8472 7.62441 18.4939 7.18 18.4922H5.56491Z" fill="#FFCA28"/>
        <path d="M22.5535 7.37109C20.0384 7.37109 17.7685 7.59613 16.0722 7.97629C15.2241 8.16637 14.522 8.38876 13.9639 8.68546C13.6849 8.83381 13.4384 9.00123 13.229 9.23169C13.0197 9.46215 12.8418 9.79265 12.8418 10.1643V14.815C12.8425 14.8406 12.8516 14.8618 12.8545 14.8864C12.8544 14.8903 12.853 14.8934 12.8529 14.8973C12.831 15.0051 12.7002 15.6932 12.7912 16.6105C13.4047 16.0207 13.7072 15.7052 14.2373 15.3426C14.6822 15.0383 15.3394 14.6237 16.766 14.2533C17.746 13.9988 18.9907 13.7913 20.4405 13.6822C21.1194 13.6442 21.8198 13.6186 22.5535 13.6186C23.2872 13.6186 23.9875 13.6441 24.6665 13.6822C26.1162 13.7913 27.3609 13.9988 28.341 14.2533C29.7675 14.6237 30.4248 15.0383 30.8697 15.3426C31.3997 15.7052 31.7022 16.0207 32.3158 16.6104C32.4067 15.6932 32.2758 15.0051 32.2541 14.8973C32.254 14.8934 32.2527 14.8903 32.2525 14.8864C32.2553 14.8618 32.2644 14.8406 32.2651 14.815V10.1643C32.2651 9.79265 32.0872 9.46215 31.8778 9.23169C31.6686 9.00123 31.4221 8.83381 31.143 8.68546C30.585 8.38876 29.883 8.16637 29.0348 7.97629C27.3386 7.59613 25.0686 7.37109 22.5535 7.37109Z" fill="#A0C7E7"/>
        <path d="M5.56487 18.4922C5.11799 18.4905 4.75436 18.8447 4.75257 19.2835V26.4577C4.75085 26.8989 5.11552 27.2568 5.56487 27.2552H7.18C6.73214 27.2551 6.36915 26.8978 6.37086 26.4577V19.2835C6.37264 18.8457 6.7346 18.4922 7.18 18.4922H5.56487Z" fill="#ECB200"/>
        <path d="M13.9645 8.68522C13.6854 8.83357 13.4374 9.0009 13.228 9.23136C13.0187 9.46181 12.8409 9.7937 12.8409 10.1654V14.8153C12.8415 14.8409 12.8506 14.8621 12.8535 14.8866C12.8534 14.8905 12.852 14.8936 12.8519 14.8975C12.83 15.0053 12.6993 15.6932 12.7903 16.6104C13.4037 16.0206 13.7062 15.7054 14.2363 15.3428C14.292 15.3047 14.364 15.2599 14.4275 15.2187C14.4441 15.0984 14.4638 14.9288 14.4702 14.8975C14.4703 14.8936 14.4716 14.8905 14.4718 14.8866C14.4689 14.862 14.4598 14.8408 14.4591 14.8153V10.1654C14.4591 9.7937 14.637 9.46181 14.8463 9.23136C15.0557 9.0009 15.3037 8.83357 15.5828 8.68522C16.1409 8.38852 16.8428 8.16626 17.691 7.97618C19.2004 7.6379 21.1764 7.42268 23.3629 7.37932C23.092 7.37392 22.831 7.37109 22.5537 7.37109C20.0386 7.37109 17.769 7.59603 16.0727 7.97618C15.2245 8.16626 14.5226 8.38852 13.9645 8.68522Z" fill="#74ADDC"/>
        <path d="M15.088 18.5879C14.6436 18.5896 14.2838 18.9429 14.282 19.3792V23.3666C14.282 26.9293 16.6268 29.9458 19.8843 31.0342C17.1352 29.5507 15.2713 26.6864 15.2713 23.3914V19.1014C15.272 18.9159 15.3341 18.7357 15.4483 18.5879H15.088Z" fill="#FFB889"/>
        <path d="M11.2619 43.1219C10.774 43.1006 10.3782 43.5052 10.4196 43.983V47.8773H12.0316V43.983C12.0706 43.5335 11.721 43.1423 11.2619 43.1219Z" fill="#3385C8"/>
        <path d="M33.9181 43.1219C33.4301 43.1006 33.0343 43.5052 33.0757 43.983V47.8773H34.6877V43.983C34.7267 43.5335 34.3771 43.1423 33.9181 43.1219Z" fill="#3385C8"/>
      </svg>
    );
};

export default CustomIcon1;
