compress:
	cd js && rm -f compressed.js && ls | egrep -v scripts.js | xargs cat > scripts.js && yahoocompress scripts.js -o compressed.js && rm -f scripts.js