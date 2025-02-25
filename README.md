# Policy Shift Tracker

## 🚀 Overview
This project tracks **U.S. government policy changes** using the **Federal Register API** and other sources. 
It allows users to **search, filter, and track major policy shifts**, including those related to **tech privatization, Elon Musk, and AI regulations**.

## 📂 Features
- 🔍 **Real-time policy tracking**
- 📊 **Search by keywords & filters**
- 🚨 **Planned feature: Alerts for specific topics (Musk, SpaceX, etc.)**
- 🕒 **Planned feature: Historical tracking of policy changes**
- 📈 **Planned feature: Policy trend timeline**

## 🛠️ Installation (Local Development)
To run locally:
```sh
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```
Since this project is a static web app (HTML, CSS, JavaScript), simply open `index.html` in a browser.

If you plan to host it on **Cloudflare Pages**, follow the [Deployment Guide](#deployment).

## 🔗 API References
- **Federal Register API**: [https://www.federalregister.gov/developers](https://www.federalregister.gov/developers)
- **Planned: GovTrack API** (Legislation Tracking)
- **Planned: USAspending API** (Federal Contracts)

## 📢 Deployment Guide
This project is being deployed on **Cloudflare Pages** from a **GitHub repository**.

### 🚀 Steps to Deploy on Cloudflare Pages:
1. **Create a GitHub Repository** (if not done already).
2. **Push this project to GitHub**:
   ```sh
   git init
   git add .
   git commit -m "Initial commit from Glitch"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```
3. **Go to [Cloudflare Pages](https://pages.cloudflare.com/)**.
4. **Click "Create a Project" → Connect GitHub**.
5. **Select the Repository** for this project.
6. **Use Default Build Settings** (this is a static site, no need for build commands).
7. **Click "Deploy"**!

### 📡 Automated Deployment:
- Whenever you push to `main` on GitHub, Cloudflare **automatically redeploys the latest version**.

## ✨ Contributing
Want to improve this tracker? Feel free to **submit issues** or **pull requests**!

## 📜 License
This project is open-source under the **MIT License**.