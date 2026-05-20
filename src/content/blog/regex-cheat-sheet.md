---
title: "Regex Cheat Sheet for Web Developers"
description: "A practical regex cheat sheet with examples for common web development tasks."
date: 2026-05-11
author: "BeautifulJSON"
tags: ["regex", "tutorial", "web-development"]
---

## Regular Expressions Cheat Sheet

Regular expressions (regex) are patterns used to match character combinations in strings. They're essential for form validation, text processing, and search functionality.

## Common Patterns

### Email Validation
```regex
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```

### URL Validation
```regex
https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)
```

### Phone Number (US)
```regex
^\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$
```

## Quick Reference

| Pattern | Description |
|---------|-------------|
| `.` | Any character |
| `*` | Zero or more |
| `+` | One or more |
| `?` | Zero or one |
| `{n}` | Exactly n times |
| `[abc]` | Character class |
| `^` | Start of string |
| `$` | End of string |
| `\d` | Digit [0-9] |
| `\w` | Word character [a-zA-Z0-9_] |
| `\s` | Whitespace |

## Try It Yourself

Use our [Regex Tester](/en/format/regex-tester) to test patterns in real-time, or use the [Regex Code Generator](/en/format/regex-code-generator) to generate code for JavaScript, Python, Java, Go, PHP, and Ruby.
