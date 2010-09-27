compress:
    cd js && rm -f compressed.js && cat tocompress | xargs cat > scripts.js && yahoocompress scripts.js -o compressed.js && rm -f scripts.js