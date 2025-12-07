import { Form } from '@inertiajs/react';

export default function LocaleSelector({
    locales,
    currentLocale,
}: {
    locales: string[];
    currentLocale: string;
}) {
    return (
        <Form
            method="post"
            action="/settings/appearance/locale"
            className="flex items-center gap-2"
            onSuccess={() => window.location.reload()}
        >
            <select
                name="locale"
                defaultValue={currentLocale}
                className="rounded border px-2 py-1"
            >
                {locales.map((loc) => (
                    <option key={loc} value={loc}>
                        {loc}
                    </option>
                ))}
            </select>

            <button
                type="submit"
                className="rounded bg-black px-3 py-1 text-white"
            >
                Save
            </button>
        </Form>
    );
}
