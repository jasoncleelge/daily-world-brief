const SCRIPT_PROPERTIES = {
  SPREADSHEET_ID: 'SPREADSHEET_ID',
  SITE_URL: 'SITE_URL',
  SENDER_NAME: 'SENDER_NAME'
};

const SHEET_NAME = 'Subscribers';
const SHEET_COLUMNS = [
  'email',
  'status',
  'confirmation_token',
  'unsubscribe_token',
  'created_at',
  'confirmed_at',
  'unsubscribed_at',
  'last_sent_at'
];

const STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  UNSUBSCRIBED: 'unsubscribed'
};

const RESPONSE_CODES = {
  OK: 'ok',
  DUPLICATE: 'duplicate',
  INVALID_EMAIL: 'invalid_email',
  ERROR: 'error'
};

const TOKEN_EXPIRY_HOURS = 14 * 24;
const FEED_LOOKBACK_HOURS = 30;
const FEED_ITEM_LIMIT_PER_FEED = 25;
const REGIONAL_STORY_LIMIT = 5;
const MIN_STORY_SCORE = 18;
const DUPLICATE_SIMILARITY_THRESHOLD = 0.62;
const SEOUL_TIMEZONE = 'Asia/Seoul';

const SCORING_WEIGHTS = {
  SOURCE_PRIORITY: 4,
  SOURCE_COVERAGE: 7,
  RECENCY: 10,
  DESCRIPTION_BONUS: 2
};

const POSITIVE_KEYWORD_CATEGORIES = [
  {
    name: 'Major election',
    weight: 18,
    terms: ['election', 'vote', 'ballot', 'campaign', 'primary', '선거', '투표', '대선', '총선']
  },
  {
    name: 'Government decision',
    weight: 12,
    terms: ['government decision', 'cabinet approves', 'policy decision', 'regulation', '정부', '국무회의', '정책', '규제']
  },
  {
    name: 'President or prime minister',
    weight: 12,
    terms: ['president', 'prime minister', 'white house', '대통령', '총리', '청와대', '대통령실']
  },
  {
    name: 'Parliament or legislature',
    weight: 10,
    terms: ['congress', 'senate', 'house of representatives', 'parliament', 'legislature', '국회', '의회', '상원', '하원']
  },
  {
    name: 'Supreme or constitutional court',
    weight: 12,
    terms: ['supreme court', 'constitutional court', '헌법재판소', '대법원', '헌재']
  },
  {
    name: 'Central bank',
    weight: 12,
    terms: ['central bank', 'federal reserve', 'fed', 'bank of korea', '한국은행', '중앙은행', '금통위']
  },
  {
    name: 'Interest rates',
    weight: 12,
    terms: ['interest rate', 'rates', 'rate cut', 'rate hike', '금리', '기준금리', '인하', '인상']
  },
  {
    name: 'Inflation',
    weight: 10,
    terms: ['inflation', 'consumer prices', 'cpi', '물가', '인플레이션', '소비자물가']
  },
  {
    name: 'Major economic decision',
    weight: 12,
    terms: ['budget', 'stimulus', 'sanctions', 'economic package', 'tax bill', '예산', '추경', '경제대책', '세제']
  },
  {
    name: 'Trade or tariffs',
    weight: 10,
    terms: ['trade', 'tariff', 'export control', 'import ban', '무역', '관세', '수출통제', '수입금지']
  },
  {
    name: 'War or international conflict',
    weight: 18,
    terms: ['war', 'missile', 'invasion', 'ceasefire', 'attack', 'conflict', '전쟁', '미사일', '공습', '휴전', '충돌']
  },
  {
    name: 'International diplomacy',
    weight: 10,
    terms: ['summit', 'treaty', 'diplomacy', 'united nations', 'nato', '외교', '정상회담', '조약', '유엔']
  },
  {
    name: 'Earthquake',
    weight: 14,
    terms: ['earthquake', 'quake', '지진']
  },
  {
    name: 'Flood',
    weight: 12,
    terms: ['flood', 'flooding', '홍수', '침수']
  },
  {
    name: 'Wildfire',
    weight: 12,
    terms: ['wildfire', 'forest fire', '산불']
  },
  {
    name: 'Typhoon or hurricane',
    weight: 12,
    terms: ['typhoon', 'hurricane', 'cyclone', '태풍', '허리케인']
  },
  {
    name: 'Public health emergency',
    weight: 14,
    terms: ['public health emergency', 'outbreak', 'pandemic', 'epidemic', '질병', '감염병', '유행', '공중보건']
  },
  {
    name: 'Major cyberattack',
    weight: 12,
    terms: ['cyberattack', 'ransomware', 'data breach', 'hacked', '사이버공격', '랜섬웨어', '해킹', '정보유출']
  },
  {
    name: 'Major infrastructure disruption',
    weight: 12,
    terms: ['blackout', 'power outage', 'rail shutdown', 'airport shutdown', 'infrastructure', '정전', '철도', '공항', '통신 장애']
  },
  {
    name: 'Significant technology or semiconductor development',
    weight: 10,
    terms: ['semiconductor', 'chip', 'artificial intelligence', 'ai chip', 'technology deal', '반도체', '인공지능', 'AI', '기술']
  }
];

const NEGATIVE_KEYWORD_CATEGORIES = [
  {
    name: 'Celebrity',
    weight: 14,
    terms: ['celebrity', 'actor', 'singer', 'red carpet', '연예인', '배우', '가수']
  },
  {
    name: 'Entertainment',
    weight: 12,
    terms: ['movie', 'box office', 'album', 'tv show', 'entertainment', '영화', '드라마', '예능']
  },
  {
    name: 'Lifestyle',
    weight: 10,
    terms: ['lifestyle', 'fashion', 'travel tips', 'recipe', '라이프', '패션', '레시피']
  },
  {
    name: 'Review',
    weight: 10,
    terms: ['review', 'hands-on', '리뷰', '사용기']
  },
  {
    name: 'Opinion',
    weight: 12,
    terms: ['opinion', 'column', 'editorial', 'op-ed', '사설', '칼럼', '오피니언']
  },
  {
    name: 'Routine sports result',
    weight: 10,
    terms: ['score', 'defeats', 'wins game', 'match result', 'sports', '스포츠', '경기 결과', '승리']
  },
  {
    name: 'Minor local crime',
    weight: 10,
    terms: ['arrested', 'shoplifting', 'minor crash', 'local police', '절도', '검거', '경찰서']
  },
  {
    name: 'Promotional content',
    weight: 14,
    terms: ['sponsored', 'promotion', 'sale', 'discount', 'coupon', '프로모션', '할인', '광고']
  }
];

const STOP_WORDS = [
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'have', 'in', 'is',
  'it', 'its', 'new', 'of', 'on', 'or', 'says', 'the', 'to', 'up', 'with', 'after', 'over'
];

const USA_FEEDS = [
  {
    name: "NPR News",
    url: "https://feeds.npr.org/1001/rss.xml",
    priority: 5,
    region: "USA"
  },
  {
    name: "NPR National",
    url: "https://feeds.npr.org/1003/rss.xml",
    priority: 4,
    region: "USA"
  },
  {
    name: "BBC US & Canada",
    url: "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml",
    priority: 4,
    region: "USA"
  }
];

const KOREA_FEEDS = [
  {
    name: "Yonhap News TV Politics",
    url: "https://www.yonhapnewstv.co.kr/category/news/politics/feed/",
    priority: 5,
    region: "KOREA"
  },
  {
    name: "Yonhap News TV Economy",
    url: "https://www.yonhapnewstv.co.kr/category/news/economy/feed/",
    priority: 5,
    region: "KOREA"
  },
  {
    name: "Yonhap News TV Society",
    url: "https://www.yonhapnewstv.co.kr/category/news/society/feed/",
    priority: 4,
    region: "KOREA"
  }
];

const WORLD_FEEDS = [
  {
    name: "BBC World",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    priority: 5,
    region: "WORLD"
  },
  {
    name: "Al Jazeera",
    url: "https://www.aljazeera.com/xml/rss/all.xml",
    priority: 4,
    region: "WORLD"
  }
];

function doPost(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = String(params.action || '').trim();

    if (action !== 'subscribe') {
      return jsonResponse_({ ok: false, code: RESPONSE_CODES.ERROR });
    }

    const website = String(params.website || '').trim();
    if (website) {
      return jsonResponse_({ ok: true, code: RESPONSE_CODES.OK });
    }

    const email = normalizeEmail_(params.email);
    if (!isValidEmail_(email)) {
      return jsonResponse_({ ok: false, code: RESPONSE_CODES.INVALID_EMAIL });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(20000);
    let confirmationSubscriber = null;

    try {
      const sheet = getSubscribersSheet_();
      const rows = readSubscriberRows_(sheet);
      const existingRows = findSubscribersByEmail_(rows, email);
      const activeRecord = existingRows.find(function(row) {
        return row.status === STATUS.ACTIVE;
      });
      const pendingRecord = existingRows.find(function(row) {
        return row.status === STATUS.PENDING;
      });
      const unsubscribedRecord = existingRows.find(function(row) {
        return row.status === STATUS.UNSUBSCRIBED;
      });

      if (activeRecord) {
        return jsonResponse_({ ok: false, code: RESPONSE_CODES.DUPLICATE });
      }

      if (pendingRecord && !isConfirmationExpired_(pendingRecord.created_at)) {
        confirmationSubscriber = pendingRecord;
      } else {
        const now = new Date();
        const subscriber = {
          email: email,
          status: STATUS.PENDING,
          confirmation_token: createSecureToken_(),
          unsubscribe_token: createSecureToken_(),
          created_at: now,
          confirmed_at: '',
          unsubscribed_at: '',
          last_sent_at: ''
        };

        if (pendingRecord || unsubscribedRecord) {
          updateSubscriberRow_(sheet, (pendingRecord || unsubscribedRecord).rowNumber, subscriber);
        } else {
          appendSubscriber_(sheet, subscriber);
        }

        confirmationSubscriber = subscriber;
      }
    } finally {
      lock.releaseLock();
    }

    sendConfirmationEmail_(confirmationSubscriber);
    return jsonResponse_({ ok: true, code: RESPONSE_CODES.OK });
  } catch (error) {
    console.log('Subscription request failed.');
    return jsonResponse_({ ok: false, code: RESPONSE_CODES.ERROR });
  }
}

function doGet(e) {
  try {
    const params = e && e.parameter ? e.parameter : {};
    const action = String(params.action || '').trim();
    const token = String(params.token || '').trim();

    if (action === 'confirm') {
      return handleConfirmation_(token);
    }

    if (action === 'unsubscribe') {
      return handleUnsubscribe_(token);
    }

    return htmlPage_('Daily World Brief', 'This link is not valid.');
  } catch (error) {
    console.log('Public link request failed.');
    return htmlPage_('Daily World Brief', 'This request could not be completed.');
  }
}

function handleConfirmation_(token) {
  if (!isValidToken_(token)) {
    return htmlPage_('Confirmation link expired', 'Please subscribe again if you still want to receive Daily World Brief.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    const sheet = getSubscribersSheet_();
    const rows = readSubscriberRows_(sheet);
    const record = findSubscriberByToken_(rows, 'confirmation_token', token);

    if (!record || record.status !== STATUS.PENDING || isConfirmationExpired_(record.created_at)) {
      return htmlPage_('Confirmation link expired', 'Please subscribe again if you still want to receive Daily World Brief.');
    }

    updateSubscriberRow_(sheet, record.rowNumber, {
      status: STATUS.ACTIVE,
      confirmed_at: new Date()
    });

    return htmlPage_('Subscription confirmed', 'You are now subscribed to Daily World Brief.');
  } finally {
    lock.releaseLock();
  }
}

function handleUnsubscribe_(token) {
  if (!isValidToken_(token)) {
    return htmlPage_('Unsubscribe link invalid', 'This unsubscribe link is not valid.');
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    const sheet = getSubscribersSheet_();
    const rows = readSubscriberRows_(sheet);
    const record = findSubscriberByToken_(rows, 'unsubscribe_token', token);

    if (!record) {
      return htmlPage_('Unsubscribe link invalid', 'This unsubscribe link is not valid.');
    }

    if (record.status !== STATUS.UNSUBSCRIBED) {
      updateSubscriberRow_(sheet, record.rowNumber, {
        status: STATUS.UNSUBSCRIBED,
        unsubscribed_at: new Date()
      });
    }

    return htmlPage_('Unsubscribed', 'You have been unsubscribed from Daily World Brief.');
  } finally {
    lock.releaseLock();
  }
}

function sendDailyNewsletter() {
  const quota = MailApp.getRemainingDailyQuota();
  if (quota <= 0) {
    console.log('Daily newsletter skipped: no MailApp quota remaining.');
    return;
  }

  const subscribers = getActiveSubscribers_();
  if (subscribers.length === 0) {
    console.log('Daily newsletter skipped: no active subscribers.');
    return;
  }

  const processed = buildRegionalBrief_();
  const dateLabel = Utilities.formatDate(new Date(), SEOUL_TIMEZONE, 'yyyy-MM-dd');
  const subject = 'Daily World Brief - ' + dateLabel;
  const senderName = getRequiredProperty_(SCRIPT_PROPERTIES.SENDER_NAME);
  const maxToSend = Math.min(quota, subscribers.length);
  let sent = 0;
  let failed = 0;

  for (let i = 0; i < maxToSend; i += 1) {
    const subscriber = subscribers[i];
    const unsubscribeUrl = buildPublicActionUrl_('unsubscribe', subscriber.unsubscribe_token);
    const htmlBody = buildNewsletterHtml_(processed, dateLabel, unsubscribeUrl);
    const textBody = buildNewsletterText_(processed, dateLabel, unsubscribeUrl);

    try {
      MailApp.sendEmail({
        to: subscriber.email,
        subject: subject,
        body: textBody,
        htmlBody: htmlBody,
        name: senderName
      });
      updateLastSentAt_(subscriber.email, new Date());
      sent += 1;
    } catch (error) {
      failed += 1;
      console.log('Newsletter delivery failed for one subscriber.');
    }
  }

  if (subscribers.length > maxToSend) {
    console.log('Daily newsletter quota limit reached before all active subscribers were processed.');
  }

  console.log('Daily newsletter finished. Sent: ' + sent + '. Failed: ' + failed + '.');
}

function setupDailyTrigger() {
  removeDailyTrigger();
  ScriptApp.newTrigger('sendDailyNewsletter')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();
  console.log('Daily trigger created for the 8 AM hour in the project timezone.');
}

function removeDailyTrigger() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'sendDailyNewsletter') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  console.log('Existing daily newsletter triggers removed.');
}

function testSheetConnection() {
  const sheet = getSubscribersSheet_();
  console.log('Sheet connection OK. Subscriber rows: ' + Math.max(0, sheet.getLastRow() - 1) + '.');
}

function testEmailToOwner() {
  const ownerEmail = getOwnerEmail_();
  MailApp.sendEmail({
    to: ownerEmail,
    subject: 'Daily World Brief test email',
    body: 'This is a Daily World Brief MailApp test sent only to the signed-in script account.',
    name: getRequiredProperty_(SCRIPT_PROPERTIES.SENDER_NAME)
  });
  console.log('Owner-only test email sent.');
}

function testFeeds() {
  const groups = [
    { name: 'USA', feeds: USA_FEEDS },
    { name: 'KOREA', feeds: KOREA_FEEDS },
    { name: 'WORLD', feeds: WORLD_FEEDS }
  ];

  groups.forEach(function(group) {
    console.log('Testing region: ' + group.name);

    group.feeds.forEach(function(feed) {
      try {
        const xml = fetchFeedXml(feed.url);

        console.log(
          '[OK] ' +
          feed.name +
          ' | response length: ' +
          xml.length
        );
      } catch (error) {
        console.error(
          '[FAILED] ' +
          feed.name +
          ' | ' +
          error.message
        );
      }
    });
  });
}

function testNewsletterPreview() {
  const processed = buildRegionalBrief_();
  const dateLabel = Utilities.formatDate(new Date(), SEOUL_TIMEZONE, 'yyyy-MM-dd');
  const previewUrl = getRequiredProperty_(SCRIPT_PROPERTIES.SITE_URL);
  const textBody = buildNewsletterText_(processed, dateLabel, previewUrl);
  console.log(textBody.substring(0, 5000));
  return textBody;
}

function testSendDailyNewsletterToOwner() {
  const ownerEmail = getOwnerEmail_();
  const processed = buildRegionalBrief_();
  const dateLabel = Utilities.formatDate(new Date(), SEOUL_TIMEZONE, 'yyyy-MM-dd');
  const unsubscribeUrl = getRequiredProperty_(SCRIPT_PROPERTIES.SITE_URL);

  MailApp.sendEmail({
    to: ownerEmail,
    subject: 'Daily World Brief owner preview - ' + dateLabel,
    body: buildNewsletterText_(processed, dateLabel, unsubscribeUrl),
    htmlBody: buildNewsletterHtml_(processed, dateLabel, unsubscribeUrl),
    name: getRequiredProperty_(SCRIPT_PROPERTIES.SENDER_NAME)
  });

  console.log('Owner-only newsletter preview sent.');
}

function sendConfirmationEmail_(subscriber) {
  const confirmationUrl = buildPublicActionUrl_('confirm', subscriber.confirmation_token);
  const senderName = getRequiredProperty_(SCRIPT_PROPERTIES.SENDER_NAME);
  const html = [
    '<p>Confirm your subscription to <strong>Daily World Brief</strong>.</p>',
    '<p><a href="' + escapeAttribute_(confirmationUrl) + '">Confirm subscription</a></p>',
    '<p>If you did not request this email, you can ignore it.</p>'
  ].join('');
  const text = [
    'Confirm your subscription to Daily World Brief:',
    confirmationUrl,
    '',
    'If you did not request this email, you can ignore it.'
  ].join('\n');

  MailApp.sendEmail({
    to: subscriber.email,
    subject: 'Confirm your Daily World Brief subscription',
    body: text,
    htmlBody: html,
    name: senderName
  });
}

function buildRegionalBrief_() {
  return buildRegionalBriefFromCandidates_(fetchAllFeedCandidates_());
}

function buildRegionalBriefFromCandidates_(candidates) {
  const deduped = dedupeStories_(candidates);
  const scored = deduped.map(scoreStory_).filter(isQualifiedStory_);

  scored.sort(function(a, b) {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.publishedAt.getTime() - a.publishedAt.getTime();
  });

  return {
    USA: scored.filter(function(item) { return item.region === 'USA'; }).slice(0, REGIONAL_STORY_LIMIT),
    KOREA: scored.filter(function(item) { return item.region === 'KOREA'; }).slice(0, REGIONAL_STORY_LIMIT),
    WORLD: scored.filter(function(item) { return item.region === 'WORLD'; }).slice(0, REGIONAL_STORY_LIMIT)
  };
}

function fetchAllFeedCandidates_() {
  const feeds = USA_FEEDS.concat(KOREA_FEEDS).concat(WORLD_FEEDS);
  let allItems = [];

  feeds.forEach(function(feed) {
    const items = fetchFeedCandidates_(feed);
    allItems = allItems.concat(items);
  });

  return allItems;
}

function fetchFeedCandidates_(feed) {
  if (!isValidHttpUrl_(feed.url)) {
    console.log('Feed skipped because URL is not http or https: ' + feed.name);
    return [];
  }

  try {
    const xml = fetchFeedXml(feed.url);
    const parsed = parseFeedXml_(xml, feed).slice(0, FEED_ITEM_LIMIT_PER_FEED);
    console.log('Feed OK: ' + feed.name + '. Accepted candidates: ' + parsed.length + '.');
    return parsed;
  } catch (error) {
    console.log('Feed failed: ' + feed.name + '. ' + safeErrorMessage_(error));
    return [];
  }
}

function fetchFeedXml(feedUrl) {
  const options = {
    method: 'get',
    followRedirects: true,
    muteHttpExceptions: true,
    validateHttpsCertificates: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; DailyWorldBriefRSS/1.0)',
      'Accept': 'application/rss+xml, application/xml, text/xml, */*'
    }
  };

  const response = UrlFetchApp.fetch(feedUrl, options);
  const statusCode = response.getResponseCode();
  const body = response.getContentText('UTF-8');

  if (statusCode < 200 || statusCode >= 300) {
    throw new Error(
      'Feed request failed with HTTP ' +
      statusCode +
      ': ' +
      feedUrl
    );
  }

  if (!body || body.trim().length < 50) {
    throw new Error('Feed returned an empty response: ' + feedUrl);
  }

  return body;
}

function parseFeedXml_(xml, feed) {
  const document = XmlService.parse(xml);
  const root = document.getRootElement();
  const rootName = root.getName().toLowerCase();

  if (rootName === 'rss' || rootName === 'rdf') {
    return parseRssFeed_(root, feed);
  }

  if (rootName === 'feed') {
    return parseAtomFeed_(root, feed);
  }

  console.log('Feed skipped because format is not RSS or Atom: ' + feed.name);
  return [];
}

function parseRssFeed_(root, feed) {
  const channel = getFirstChildByName_(root, 'channel') || root;
  let items = getChildrenByName_(channel, 'item');

  if (!items.length && channel !== root) {
    items = getChildrenByName_(root, 'item');
  }

  return items.map(function(item) {
    return makeCandidate_({
      title: getChildTextByName_(item, 'title'),
      description: getChildTextByName_(item, 'description'),
      url: getChildTextByName_(item, 'link'),
      sourceName: feed.name,
      publishedAt: parseDate_(getChildTextByName_(item, 'pubDate') || getChildTextByName_(item, 'date')),
      feed: feed
    });
  }).filter(Boolean);
}

function parseAtomFeed_(root, feed) {
  const entries = getChildrenByName_(root, 'entry');

  return entries.map(function(entry) {
    return makeCandidate_({
      title: getChildTextByName_(entry, 'title'),
      description: getChildTextByName_(entry, 'summary'),
      url: getAtomEntryUrl_(entry),
      sourceName: feed.name,
      publishedAt: parseDate_(getChildTextByName_(entry, 'published') || getChildTextByName_(entry, 'updated')),
      feed: feed
    });
  }).filter(Boolean);
}

function makeCandidate_(raw) {
  const title = cleanText_(raw.title);
  const description = trimToLength_(cleanText_(raw.description), 520);
  const url = normalizeUrl_(raw.url);

  if (!title || !isValidHttpUrl_(url) || !raw.publishedAt) {
    return null;
  }

  if (!isRecentDate_(raw.publishedAt, FEED_LOOKBACK_HOURS)) {
    return null;
  }

  if (!passesLanguageRules_(raw.feed.region, title, description)) {
    return null;
  }

  return {
    title: title,
    description: description,
    url: url,
    sourceName: cleanText_(raw.sourceName),
    publishedAt: raw.publishedAt,
    sourcePriority: Number(raw.feed.priority) || 1,
    region: raw.feed.region,
    sourceCount: 1,
    sources: [cleanText_(raw.sourceName)]
  };
}

function passesLanguageRules_(region, title, description) {
  const text = title + ' ' + description;

  if (region === 'KOREA') {
    return containsMeaningfulKorean_(text);
  }

  return containsMeaningfulEnglish_(text) && !containsMeaningfulKorean_(text);
}

function containsMeaningfulKorean_(text) {
  const matches = String(text || '').match(/[가-힣]/g);
  return matches ? matches.length >= 8 : false;
}

function containsMeaningfulEnglish_(text) {
  const matches = String(text || '').match(/[A-Za-z]{3,}/g);
  return matches ? matches.length >= 3 : false;
}

function dedupeStories_(items) {
  const groups = [];

  items.forEach(function(item) {
    const duplicate = groups.find(function(group) {
      return headlineSimilarity_(group.representative.title, item.title) >= DUPLICATE_SIMILARITY_THRESHOLD;
    });

    if (!duplicate) {
      groups.push({
        representative: item,
        normalizedTitles: [normalizeHeadline_(item.title)]
      });
      return;
    }

    duplicate.representative = mergeDuplicateStories_(duplicate.representative, item);
    duplicate.normalizedTitles.push(normalizeHeadline_(item.title));
  });

  return groups.map(function(group) {
    return group.representative;
  });
}

function mergeDuplicateStories_(current, incoming) {
  const mergedSources = uniqueStrings_(current.sources.concat(incoming.sources));
  const mergedSourceCount = mergedSources.length;
  const incomingDescriptionBetter = incoming.description.length > current.description.length + 40;
  const incomingPriorityBetter = incoming.sourcePriority > current.sourcePriority;
  const shouldReplace = incomingPriorityBetter || (incoming.sourcePriority === current.sourcePriority && incomingDescriptionBetter);
  const winner = shouldReplace ? incoming : current;

  winner.sourceCount = mergedSourceCount;
  winner.sources = mergedSources;
  return winner;
}

function scoreStory_(story) {
  const text = (story.title + ' ' + story.description).toLowerCase();
  const positive = scoreKeywordCategories_(text, POSITIVE_KEYWORD_CATEGORIES);
  const negative = scoreKeywordCategories_(text, NEGATIVE_KEYWORD_CATEGORIES);
  const ageHours = Math.max(0, (new Date().getTime() - story.publishedAt.getTime()) / 36e5);
  const recencyScore = Math.max(0, (1 - ageHours / FEED_LOOKBACK_HOURS) * SCORING_WEIGHTS.RECENCY);
  const descriptionBonus = story.description.length >= 140 ? SCORING_WEIGHTS.DESCRIPTION_BONUS : 0;
  const sourceScore = story.sourcePriority * SCORING_WEIGHTS.SOURCE_PRIORITY;
  const coverageScore = Math.max(0, story.sourceCount - 1) * SCORING_WEIGHTS.SOURCE_COVERAGE;

  story.positiveKeywordScore = positive;
  story.negativeKeywordScore = negative;
  story.score = sourceScore + coverageScore + positive + recencyScore + descriptionBonus - negative;
  return story;
}

function isQualifiedStory_(story) {
  if (story.negativeKeywordScore >= 14 && story.positiveKeywordScore === 0) {
    return false;
  }

  if (story.sourceCount === 1 && story.positiveKeywordScore < 8) {
    return false;
  }

  return story.score >= MIN_STORY_SCORE;
}

function scoreKeywordCategories_(text, categories) {
  return categories.reduce(function(total, category) {
    const matched = category.terms.some(function(term) {
      return text.indexOf(String(term).toLowerCase()) !== -1;
    });
    return matched ? total + category.weight : total;
  }, 0);
}

function buildNewsletterHtml_(regions, dateLabel, unsubscribeUrl) {
  const sections = [
    renderHtmlSection_('USA', regions.USA, englishSectionLabels_()),
    renderHtmlSection_('대한민국', regions.KOREA, koreanSectionLabels_()),
    renderHtmlSection_('Other Countries', regions.WORLD, englishSectionLabels_())
  ].join('');

  return [
    '<!doctype html>',
    '<html>',
    '<body style="margin:0;padding:0;background:#f4f7f8;color:#17202a;font-family:Arial,sans-serif;">',
    '<div style="max-width:680px;margin:0 auto;padding:28px 18px;">',
    '<h1 style="margin:0 0 6px;font-size:30px;line-height:1.2;">Daily World Brief</h1>',
    '<p style="margin:0 0 24px;color:#596777;">' + escapeHtml_(dateLabel) + '</p>',
    sections,
    '<hr style="border:0;border-top:1px solid #d8e0e5;margin:28px 0;">',
    '<p style="font-size:13px;line-height:1.6;color:#596777;">',
    'The briefing uses free public RSS feeds. Summaries are based only on text supplied in those RSS feeds. ',
    'The ranking is an automated importance estimate. ',
    '<a href="' + escapeAttribute_(unsubscribeUrl) + '">Unsubscribe</a>.',
    '</p>',
    '</div>',
    '</body>',
    '</html>'
  ].join('');
}

function renderHtmlSection_(title, stories, labels) {
  const safeTitle = escapeHtml_(title);

  if (!stories.length) {
    return [
      '<h2 style="margin:28px 0 12px;font-size:20px;">' + safeTitle + '</h2>',
      '<p style="margin:0 0 18px;color:#596777;">' + escapeHtml_(labels.empty) + '</p>'
    ].join('');
  }

  const items = stories.map(function(story) {
    return [
      '<li style="margin:0 0 18px;padding-left:4px;">',
      '<p style="margin:0 0 6px;font-weight:bold;line-height:1.4;">',
      '<a style="color:#0b6b75;" href="' + escapeAttribute_(story.url) + '">' + escapeHtml_(story.title) + '</a>',
      '</p>',
      story.description ? '<p style="margin:0 0 8px;line-height:1.55;color:#303b46;">' + escapeHtml_(story.description) + '</p>' : '',
      '<p style="margin:0;color:#596777;font-size:13px;">' + escapeHtml_(labels.source) + ': ' + escapeHtml_(story.sourceName) + ' | ',
      '<a style="color:#0b6b75;" href="' + escapeAttribute_(story.url) + '">' + escapeHtml_(labels.link) + '</a></p>',
      '</li>'
    ].join('');
  }).join('');

  return [
    '<h2 style="margin:28px 0 12px;font-size:20px;">' + safeTitle + '</h2>',
    '<ol style="margin:0 0 20px 22px;padding:0;">' + items + '</ol>'
  ].join('');
}

function buildNewsletterText_(regions, dateLabel, unsubscribeUrl) {
  return [
    'Daily World Brief',
    dateLabel,
    '',
    renderTextSection_('USA', regions.USA, englishSectionLabels_()),
    renderTextSection_('대한민국', regions.KOREA, koreanSectionLabels_()),
    renderTextSection_('Other Countries', regions.WORLD, englishSectionLabels_()),
    'The briefing uses free public RSS feeds.',
    'Summaries are based only on text supplied in those RSS feeds.',
    'The ranking is an automated importance estimate.',
    'Unsubscribe: ' + unsubscribeUrl
  ].join('\n');
}

function renderTextSection_(title, stories, labels) {
  const lines = [title];

  if (!stories.length) {
    lines.push(labels.empty, '');
    return lines.join('\n');
  }

  stories.forEach(function(story, index) {
    lines.push(String(index + 1) + '. ' + story.title);
    if (story.description) {
      lines.push(story.description);
    }
    lines.push(labels.source + ': ' + story.sourceName);
    lines.push(labels.link + ': ' + story.url);
    lines.push('');
  });

  return lines.join('\n');
}

function englishSectionLabels_() {
  return {
    empty: 'No qualified stories were available from the configured RSS feeds.',
    source: 'Source',
    link: 'Direct article link'
  };
}

function koreanSectionLabels_() {
  return {
    empty: '설정된 RSS 피드에서 적합한 기사를 찾지 못했습니다.',
    source: '출처',
    link: '기사 링크'
  };
}

function getActiveSubscribers_() {
  const sheet = getSubscribersSheet_();
  return readSubscriberRows_(sheet).filter(function(row) {
    return row.status === STATUS.ACTIVE && isValidEmail_(row.email) && isValidToken_(row.unsubscribe_token);
  });
}

function updateLastSentAt_(email, sentAt) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);

  try {
    const sheet = getSubscribersSheet_();
    const rows = readSubscriberRows_(sheet);
    const record = findSubscriberByEmail_(rows, email);

    if (record && record.status === STATUS.ACTIVE) {
      updateSubscriberRow_(sheet, record.rowNumber, {
        last_sent_at: sentAt
      });
    }
  } finally {
    lock.releaseLock();
  }
}

function getSubscribersSheet_() {
  const spreadsheet = SpreadsheetApp.openById(getRequiredProperty_(SCRIPT_PROPERTIES.SPREADSHEET_ID));
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  ensureHeaderRow_(sheet);
  return sheet;
}

function ensureHeaderRow_(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, SHEET_COLUMNS.length);
  const current = headerRange.getValues()[0];
  const needsHeader = SHEET_COLUMNS.some(function(column, index) {
    return current[index] !== column;
  });

  if (needsHeader) {
    headerRange.setValues([SHEET_COLUMNS]);
    sheet.setFrozenRows(1);
  }
}

function readSubscriberRows_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return [];
  }

  const values = sheet.getRange(2, 1, lastRow - 1, SHEET_COLUMNS.length).getValues();

  return values.map(function(row, index) {
    const record = { rowNumber: index + 2 };
    SHEET_COLUMNS.forEach(function(column, columnIndex) {
      record[column] = row[columnIndex];
    });
    record.email = normalizeEmail_(record.email);
    record.status = String(record.status || '').toLowerCase();
    record.confirmation_token = String(record.confirmation_token || '').trim();
    record.unsubscribe_token = String(record.unsubscribe_token || '').trim();
    return record;
  });
}

function appendSubscriber_(sheet, subscriber) {
  sheet.appendRow(SHEET_COLUMNS.map(function(column) {
    return sanitizeSheetValue_(subscriber[column]);
  }));
}

function updateSubscriberRow_(sheet, rowNumber, updates) {
  const current = sheet.getRange(rowNumber, 1, 1, SHEET_COLUMNS.length).getValues()[0];
  const next = SHEET_COLUMNS.map(function(column, index) {
    if (Object.prototype.hasOwnProperty.call(updates, column)) {
      return sanitizeSheetValue_(updates[column]);
    }
    return current[index];
  });
  sheet.getRange(rowNumber, 1, 1, SHEET_COLUMNS.length).setValues([next]);
}

function findSubscriberByEmail_(rows, email) {
  return rows.find(function(row) {
    return row.email === email;
  });
}

function findSubscribersByEmail_(rows, email) {
  return rows.filter(function(row) {
    return row.email === email;
  });
}

function findSubscriberByToken_(rows, tokenColumn, token) {
  return rows.find(function(row) {
    return row[tokenColumn] === token;
  });
}

function normalizeEmail_(email) {
  return String(email || '').trim().toLowerCase();
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function createSecureToken_() {
  return (Utilities.getUuid() + Utilities.getUuid() + Utilities.getUuid()).replace(/-/g, '').toLowerCase();
}

function isValidToken_(token) {
  return /^[a-f0-9]{96}$/.test(String(token || ''));
}

function isConfirmationExpired_(createdAt) {
  const created = parseDate_(createdAt);
  if (!created) {
    return true;
  }
  return new Date().getTime() - created.getTime() > TOKEN_EXPIRY_HOURS * 36e5;
}

function buildPublicActionUrl_(action, token) {
  const baseUrl = ScriptApp.getService().getUrl();
  if (!baseUrl) {
    throw new Error('Deploy the Apps Script as a web app before sending public links.');
  }
  return baseUrl + '?action=' + encodeURIComponent(action) + '&token=' + encodeURIComponent(token);
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function htmlPage_(title, message) {
  const siteUrl = getOptionalProperty_(SCRIPT_PROPERTIES.SITE_URL);
  const link = siteUrl ? '<p><a href="' + escapeAttribute_(siteUrl) + '">Return to Daily World Brief</a></p>' : '';
  const html = [
    '<!doctype html>',
    '<html lang="en">',
    '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>' + escapeHtml_(title) + '</title></head>',
    '<body style="margin:0;font-family:Arial,sans-serif;background:#f4f7f8;color:#17202a;">',
    '<main style="max-width:620px;margin:12vh auto;padding:32px 20px;">',
    '<h1 style="margin:0 0 12px;">' + escapeHtml_(title) + '</h1>',
    '<p style="font-size:18px;line-height:1.6;">' + escapeHtml_(message) + '</p>',
    link,
    '</main></body></html>'
  ].join('');

  return HtmlService.createHtmlOutput(html)
    .setTitle(title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getRequiredProperty_(name) {
  const value = PropertiesService.getScriptProperties().getProperty(name);
  if (!value) {
    throw new Error('Missing Script Property: ' + name);
  }
  return value;
}

function getOptionalProperty_(name) {
  return PropertiesService.getScriptProperties().getProperty(name) || '';
}

function getOwnerEmail_() {
  const email = Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail();
  if (!isValidEmail_(email)) {
    throw new Error('Could not determine the signed-in script account email.');
  }
  return email;
}

function sanitizeSheetValue_(value) {
  if (value instanceof Date) {
    return value;
  }

  const text = String(value == null ? '' : value).trim();
  if (/^[=+\-@]/.test(text)) {
    return "'" + text;
  }
  return text;
}

function cleanText_(value) {
  return stripHtml_(decodeEntities_(String(value || '')))
    .replace(/\s+/g, ' ')
    .trim();
}

function stripHtml_(value) {
  return String(value || '').replace(/<[^>]*>/g, ' ');
}

function decodeEntities_(value) {
  const named = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
    rsquo: "'",
    lsquo: "'",
    ldquo: '"',
    rdquo: '"',
    ndash: '-',
    mdash: '-',
    hellip: '...'
  };

  return String(value || '').replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, function(match, entity) {
    if (entity.charAt(0) === '#') {
      const isHex = entity.charAt(1).toLowerCase() === 'x';
      const number = parseInt(isHex ? entity.slice(2) : entity.slice(1), isHex ? 16 : 10);
      return Number.isFinite(number) ? String.fromCharCode(number) : match;
    }
    return Object.prototype.hasOwnProperty.call(named, entity) ? named[entity] : match;
  });
}

function escapeHtml_(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute_(value) {
  return escapeHtml_(value).replace(/`/g, '&#96;');
}

function normalizeUrl_(url) {
  return decodeEntities_(String(url || '')).trim();
}

function isValidHttpUrl_(url) {
  return /^https?:\/\/[^\s<>"]+$/i.test(String(url || ''));
}

function parseDate_(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (!value) {
    return null;
  }

  const parsed = new Date(String(value));
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isRecentDate_(date, hours) {
  const timestamp = date.getTime();
  const now = new Date().getTime();
  return timestamp <= now + 15 * 60 * 1000 && now - timestamp <= hours * 36e5;
}

function trimToLength_(text, maxLength) {
  const clean = String(text || '').trim();
  if (clean.length <= maxLength) {
    return clean;
  }
  return clean.slice(0, maxLength - 1).replace(/\s+\S*$/, '') + '...';
}

function getFirstChildByName_(element, name) {
  return element.getChildren().find(function(child) {
    return child.getName().toLowerCase() === name.toLowerCase();
  }) || null;
}

function getChildrenByName_(element, name) {
  return element.getChildren().filter(function(child) {
    return child.getName().toLowerCase() === name.toLowerCase();
  });
}

function getChildTextByName_(element, name) {
  const child = getFirstChildByName_(element, name);
  return child ? child.getText() : '';
}

function getAtomEntryUrl_(entry) {
  const links = getChildrenByName_(entry, 'link');
  for (let i = 0; i < links.length; i += 1) {
    const rel = links[i].getAttribute('rel');
    const href = links[i].getAttribute('href');
    const relValue = rel ? rel.getValue() : 'alternate';

    if (href && (!relValue || relValue === 'alternate')) {
      return href.getValue();
    }
  }
  return '';
}

function normalizeHeadline_(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/\s[-|:]\s[^-|:]{2,40}$/g, ' ')
    .replace(/[^\w가-힣\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleTokens_(title) {
  const normalized = normalizeHeadline_(title);
  return uniqueStrings_(normalized.split(/\s+/).filter(function(token) {
    return token.length >= 2 && STOP_WORDS.indexOf(token) === -1;
  }));
}

function headlineSimilarity_(leftTitle, rightTitle) {
  const left = titleTokens_(leftTitle);
  const right = titleTokens_(rightTitle);

  if (!left.length || !right.length) {
    return 0;
  }

  const rightMap = {};
  right.forEach(function(token) {
    rightMap[token] = true;
  });

  const intersection = left.filter(function(token) {
    return rightMap[token];
  }).length;
  const union = uniqueStrings_(left.concat(right)).length;
  return union ? intersection / union : 0;
}

function uniqueStrings_(values) {
  const seen = {};
  const unique = [];

  values.forEach(function(value) {
    const key = String(value || '').trim();
    if (key && !seen[key]) {
      seen[key] = true;
      unique.push(key);
    }
  });

  return unique;
}

function safeErrorMessage_(error) {
  return String(error && error.message ? error.message : error).slice(0, 240);
}
