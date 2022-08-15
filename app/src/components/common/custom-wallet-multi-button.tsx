import React from 'react';
import Text from '../common/text';
import {cn} from 'utils';
import {IconType} from 'react-icons';
import {WalletDisconnectButton, WalletMultiButton} from "@solana/wallet-adapter-react-ui";

/**
 * props for a button component.
 */
type ButtonProps = {
    className?: string;
    onClick?: () => void;
    variant?:
        | 'transparent'
    text?: string;
    textColorVariant?:
        | 'black'
        | 'white'
    icon?: IconType;
    connected: boolean;
    disabled?: boolean;
};

const variants = {
    transparent: 'bg-transparent border-2',
};

const textColorVariants = {
    black: 'text-black',
    white: 'text-white',
};

/**
 *
 * @param variant Variations relating to pre-defined styling of the element
 * @param text Text to display in the button.
 */
const CustomWalletMultiButton = ({
                                     className,
                                     onClick,
                                     variant,
                                     textColorVariant,
                                     text: value,
                                     icon,
                                     connected = false,
                                     disabled = false

                                 }: ButtonProps) => (
    connected ?
        <WalletDisconnectButton
            className={cn(
                variants[variant],
                'flex h-11 max-h-full w-fit items-center justify-center gap-3 whitespace-nowrap rounded-full transition-all',
                textColorVariants[textColorVariant],
                'hover:!text-black',
                'hover:-translate-y-[0.15rem] active:translate-y-[0.025rem] active:scale-[0.975]',
                (icon && !value) ? 'aspect-square p-3' : 'px-5 py-3',
                className,
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && React.createElement(icon, {size: 20})}
            {value && (
                <Text variant='input'>
                    {value}
                </Text>
            )}
        </WalletDisconnectButton>
        :
        <WalletMultiButton
            className={cn(
                variants[variant],
                'flex h-11 max-h-full w-fit items-center justify-center gap-3 whitespace-nowrap rounded-full border transition-all',
                textColorVariants[textColorVariant],
                'hover:!text-black',
                'hover:-translate-y-[0.15rem] active:translate-y-[0.025rem] active:scale-[0.975]',
                (icon && !value) ? 'aspect-square p-3' : 'px-5 py-3',
                className,
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && React.createElement(icon, {size: 20})}
            {value && (
                <Text variant='input'>
                    {value}
                </Text>
            )}
        </WalletMultiButton>
);

export default CustomWalletMultiButton;
