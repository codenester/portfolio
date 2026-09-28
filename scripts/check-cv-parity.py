#!/usr/bin/env python3
"""Parity check between the portfolio site and the CV it publishes.

Run: ~/.venvs/cvtools/bin/python ~/Projects/portfolio/scripts/check-cv-parity.py

Fails when the site drifts from the CV: the two published files must be the current
manager build byte for byte, and the education block must describe the certificate the
CV describes, with the Agile certificate folded into the Professional Certificate and
no stale "in progress" wording.
"""
import hashlib
import os
import re
import sys

HOME = os.path.expanduser("~")
SITE = os.path.join(HOME, "Projects/portfolio")
CONTENT = os.path.join(SITE, "src/lib/content/site.ts")
CV_PDF = os.path.join(HOME, "CV-Rithea-Sreng-Manager.pdf")
CV_DOCX = os.path.join(HOME, "CV-Rithea-Sreng-Manager.docx")
PUB_PDF = os.path.join(SITE, "static/cv/Rithea-Sreng-CV.pdf")
PUB_DOCX = os.path.join(SITE, "static/cv/Rithea-Sreng-CV.docx")
CREDENTIAL = "coursera.org/account/accomplishments/specialization/8SM29XFB8QF8"

failures = []


def check(ok, label):
    print(("  PASS  " if ok else "  FAIL  ") + label)
    if not ok:
        failures.append(label)


def sha(path):
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()[:16]


def main():
    src = open(CONTENT, encoding="utf-8").read()

    # 1. the published files ARE the current manager build
    check(os.path.exists(PUB_PDF) and sha(PUB_PDF) == sha(CV_PDF),
          f"the published PDF is the current manager build (site {sha(PUB_PDF) if os.path.exists(PUB_PDF) else 'missing'} vs home {sha(CV_PDF)})")
    check(os.path.exists(PUB_DOCX) and sha(PUB_DOCX) == sha(CV_DOCX),
          f"the published DOCX is the current manager build (site {sha(PUB_DOCX) if os.path.exists(PUB_DOCX) else 'missing'} vs home {sha(CV_DOCX)})")

    # 2. the certificate is described the way the CV describes it
    check("Google Project Management Professional Certificate" in src,
          "the site names the Professional Certificate")
    # 3. the education list itself ('in progress' is legitimate for his own project further
    #    up the page, so the assertion is scoped to this block)
    block = re.search(r"export const education.*?\n\];", src, re.S).group(0)
    entries = re.findall(r"title: '([^']+)'", block)
    check("In progress" not in block, "the certificate no longer reads 'In progress'")
    check("2026" in block, "the certificate entry carries the completion year")
    check("Agile Project Management Certificate" not in src,
          "the separate Agile certificate entry is gone (covered by the Professional Certificate)")
    check(CREDENTIAL in src, "the credential verification link is on the site")
    check(len(entries) == 2, f"the education list holds the certificate and the degree (found {len(entries)}: {entries})")
    check(any("Project Management" in e for e in entries) and any("Bachelor" in e for e in entries),
          "the certificate and the degree are the two entries")

    # 4. the About paragraph no longer promises Agile as a separate credential
    check("project management and Agile certifications" not in src,
          "the About text no longer lists Agile as a separate certificate")

    # 5. the CV the site serves is still a two page A4 document
    try:
        from pypdf import PdfReader
        pages = len(PdfReader(PUB_PDF).pages)
        check(pages == 2, f"the published CV is two pages (found {pages})")
    except Exception as exc:
        check(False, f"could not read the published PDF ({exc})")

    print()
    if failures:
        print(f"RESULT: RED - {len(failures)} failing check(s)")
        for f in failures:
            print("  - " + f)
        return 1
    print("RESULT: GREEN - the site matches the CV")
    return 0


if __name__ == "__main__":
    sys.exit(main())
