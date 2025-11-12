import { useTranslation } from "react-i18next";
import { useLanguage } from "../hooks/useLanguage";
import { cn } from "../lib/utils";

interface LanguageSwitcherProps {
  isLabelVisible: boolean;
}

export function LanguageSwitcher({ isLabelVisible }: LanguageSwitcherProps) {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, options } = useLanguage();

  return (
    <div className="flex items-center gap-2 text-sm text-indigo-100 dark:text-indigo-200">
      {/* <span className="sr-only md:not-sr-only">
        {t("language.switcherLabel")}
      </span> */}
      <div className="flex items-center gap-2">
        {options.map((option) => {
          const isActive = option.value === currentLanguage;
          const label = t(option.labelKey);

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => changeLanguage(option.value)}
              aria-pressed={isActive}
              className={cn(
                "flex items-center gap-2 rounded-md border border-transparent px-2 py-1 text-xs font-medium uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300",
                isActive
                  ? "bg-white/90 text-indigo-700 shadow-sm dark:bg-indigo-200 dark:text-indigo-900"
                  : "bg-indigo-500/40 text-indigo-50 hover:bg-indigo-500/60"
              )}
            >
              <img
                src={option.icon}
                alt={label}
                className="h-5 w-5 rounded-sm object-cover"
                loading="lazy"
              />
              {isLabelVisible && <span className="sr-only md:not-sr-only">{label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
