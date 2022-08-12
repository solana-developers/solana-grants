import React from 'react';
import Text from '../common/text';
import {cn} from 'utils';
import {IconType} from 'react-icons';
import {WalletDisconnectButton, WalletMultiButton} from "@solana/wallet-adapter-react-ui";

/**
 * Properties for an interactable button component.
 */
type ButtonProps = {
    className?: string;
    reversed?: boolean;
    onClick?: () => void;
    variant:
        | 'black'
        | 'orange'
        | 'transparent'
        | 'danger'
        | 'label';
    text?: string;
    icon?: IconType;
    children?: React.ReactNode;
    ref?: React.Ref<HTMLButtonElement>;
    type?: 'button' | 'submit' | 'reset';
    connected: boolean;
    disabled?: boolean;
};

/**
 * Pre-defined styling, according to agreed-upon design-system.
 */
const variants = {
    black: 'border-transparent bg-black text-white',
    orange: 'border-transparent bg-blue-magenta text-black', // TODO: Change name of variant to `highlight`.
    transparent: 'text-white', // TODO: Change name of variant to `outlined`.
    danger: 'border-secondary text-danger hover:text-white hover:bg-secondary',
    label: 'text-secondary hover:text-white !p-0 border-none',
};

/**
 * Definition of an interactable button component.
 *
 * @param type `type` Attribute of the `<button>` element.
 * @param variant Variations relating to pre-defined styling of the element
 * @param text Text to display in the button.
 */
const CustomWalletMultiButton = ({
                                     className,
                                     reversed = false,
                                     onClick,
                                     variant = 'black',
                                     text: value,
                                     children,
                                     icon,
                                     connected = false,
                                     disabled = false,
                                 }: ButtonProps) => (
    connected ?
        <WalletDisconnectButton
            className={cn(
                variants[variant],
                'flex h-11 max-h-full w-fit items-center justify-center gap-3 whitespace-nowrap rounded-full border transition-all',
                variant !== 'label' &&
                'hover:-translate-y-[0.15rem] active:translate-y-[0.025rem] active:scale-[0.975]',
                ((icon && (!value && !children)) ? 'aspect-square p-3' : 'px-5 py-3'),
                reversed && 'flex-row-reverse',
                className,
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {icon && React.createElement(icon, {size: 20})}
            {value && (
                <Text variant={variant === 'label' ? 'label' : 'input'}>
                    {value}
                </Text>
            )}
            {children}
        </WalletDisconnectButton>
        :
        <WalletMultiButton className={cn(
            variants[variant],
            'flex h-11 max-h-full w-fit items-center justify-center gap-3 whitespace-nowrap rounded-full border transition-all',
            variant !== 'label' &&
            'hover:-translate-y-[0.15rem] active:translate-y-[0.025rem] active:scale-[0.975]',
            ((icon && (!value && !children)) ? 'aspect-square p-3' : 'px-5 py-3'),
            reversed && 'flex-row-reverse',
            className,
        )} onClick={onClick}
                           disabled={disabled}
        >
            {icon && React.createElement(icon, {size: 20})}
            {value && (
                <Text variant={variant === 'label' ? 'label' : 'input'}>
                    {value}
                </Text>
            )}
            {children}
        </WalletMultiButton>
);

export default CustomWalletMultiButton;
