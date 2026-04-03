# Viral Hooks Database
# Categorized proven hooks for high-retention short-form content

HOOKS = {
    "AI & Tech": [
        "If you're still using ChatGPT like this, you're already behind.",
        "I just found an AI tool that literally feels illegal to know.",
        "The end of the developer era is closer than you think.",
        "I replaced my entire team with this $20 AI agent.",
        "Stop scrolling if you want to see the future of computing."
    ],
    "Finance": [
        "Most people are working for money, but I made money work for me.",
        "Here is the exact portfolio that turned $1k into a million.",
        "The economy is shifting, and 99% of people are going to lose it all.",
        "Stop buying assets that don't pay you while you sleep.",
        "This is the one side-hustle that actually works in 2026."
    ],
    "Luxury": [
        "This is what a $50,000 a night hotel room actually looks like.",
        "Why the ultra-rich are suddenly dumping their Rolex collections.",
        "How to live like a billionaire on a $5,000 budget.",
        "Inside the most exclusive club you've never heard of.",
        "The truth about why wealth is quiet and rich is loud."
    ]
}

def get_hooks_by_niche(niche):
    return HOOKS.get(niche, ["Start with a bold claim about your topic."])
